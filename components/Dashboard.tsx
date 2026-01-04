
import React, { useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Transaction } from '../types';
import { EXPENSE_CATEGORIES } from '../constants';
import { ArrowUpRight, ArrowDownRight, Wallet, AlertCircle, Info } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  limits: { category: string; limit: number }[];
  theme: 'light' | 'dark' | 'pula';
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, limits, theme }) => {
  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      income,
      expenses,
      balance: income - expenses
    };
  }, [transactions]);

  const expenseData = useMemo(() => {
    const grouped = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc: Record<string, number>, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    return Object.keys(grouped).map(cat => ({
      name: EXPENSE_CATEGORIES.find(c => c.id === cat)?.name || cat,
      value: grouped[cat],
      color: EXPENSE_CATEGORIES.find(c => c.id === cat)?.color || '#64748b'
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const overages = useMemo(() => {
    return limits.filter(limit => {
      const spent = transactions
        .filter(t => t.type === 'EXPENSE' && t.category === limit.category)
        .reduce((acc, t) => acc + t.amount, 0);
      return spent > limit.limit;
    });
  }, [transactions, limits]);

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-6 rounded-[2rem] shadow-sm border flex items-center gap-5 transition-all`}>
          <div className="bg-emerald-500/10 p-4 rounded-2xl text-emerald-600">
            <ArrowUpRight size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Income</p>
            <p className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>P{stats.income.toLocaleString()}</p>
          </div>
        </div>

        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-6 rounded-[2rem] shadow-sm border flex items-center gap-5 transition-all`}>
          <div className="bg-rose-500/10 p-4 rounded-2xl text-rose-600">
            <ArrowDownRight size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expenses</p>
            <p className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>P{stats.expenses.toLocaleString()}</p>
          </div>
        </div>

        <div className={`${theme === 'pula' ? 'bg-black text-white' : isDark ? 'bg-sky-600 text-white' : 'bg-sky-500 text-white'} p-6 rounded-[2rem] shadow-lg flex items-center gap-5 transition-all`}>
          <div className="bg-white/20 p-4 rounded-2xl text-white">
            <Wallet size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs font-bold opacity-70 uppercase tracking-widest">Available</p>
            <p className="text-2xl font-extrabold">P{stats.balance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {overages.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/50 p-5 rounded-2xl flex items-center gap-4 animate-fade-in">
          <AlertCircle className="text-amber-600 shrink-0" size={24} />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-amber-900">Spending Threshold Exceeded</h4>
            <p className="text-xs text-amber-700 font-medium">
              Careful! You've crossed your budget for: {overages.map(o => EXPENSE_CATEGORIES.find(c => c.id === o.category)?.name).join(', ')}.
            </p>
          </div>
        </div>
      )}

      {/* Analytics Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-8 rounded-[2.5rem] shadow-sm border h-[420px]`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>Distribution</h3>
            <Info size={16} className="text-slate-300" />
          </div>
          <ResponsiveContainer width="100%" height="80%">
            {expenseData.length > 0 ? (
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                   formatter={(value: number) => `P${value.toLocaleString()}`} 
                />
              </PieChart>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-300 text-sm italic">
                No data to display
              </div>
            )}
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
             {expenseData.slice(0, 4).map(e => (
               <div key={e.name} className="flex items-center gap-1">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }} />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{e.name}</span>
               </div>
             ))}
          </div>
        </div>

        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-8 rounded-[2.5rem] shadow-sm border h-[420px]`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>Performance</h3>
            <div className="flex items-center gap-2">
               <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-bold text-slate-400 uppercase">In</span></div>
               <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500" /><span className="text-[10px] font-bold text-slate-400 uppercase">Out</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart
              data={[
                { name: 'Total', income: stats.income, expenses: stats.expenses }
              ]}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              barSize={60}
            >
              <XAxis dataKey="name" axisLine={false} tickLine={false} hide />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isDark ? '#475569' : '#94A3B8' }} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => `P${value.toLocaleString()}`} 
              />
              <Bar dataKey="income" fill="#10b981" radius={[20, 20, 20, 20]} />
              <Bar dataKey="expenses" fill="#f43f5e" radius={[20, 20, 20, 20]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
