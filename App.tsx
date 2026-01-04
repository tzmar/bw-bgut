
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  Target, 
  Settings as SettingsIcon, 
  Download,
  Sparkles,
  X,
  Plus,
  Trash2,
  ChevronRight,
  TrendingUp,
  Banknote
} from 'lucide-react';
import { 
  Transaction, 
  SavingsGoal, 
  AppData, 
  TransactionType
} from './types';
import { 
  getIcon, 
  EXCHANGE_RATES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  THEME_COLORS
} from './constants';
import { saveData, loadData, exportToCSV } from './services/storage';
import { getFinancialAdvice } from './services/ai';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'goals' | 'settings'>('dashboard');
  const [data, setData] = useState<AppData>({
    transactions: [],
    goals: [],
    limits: [],
    theme: 'pula'
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    const saved = loadData();
    if (saved) setData(saved);
  }, []);

  useEffect(() => {
    saveData(data);
    if (data.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [data]);

  const handleAddTransaction = (newTransaction: Transaction) => {
    setData(prev => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions]
    }));
    setShowAddModal(false);
  };

  const deleteTransaction = (id: string) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  const handleAddGoal = (goal: SavingsGoal) => {
    setData(prev => ({
      ...prev,
      goals: [...prev.goals, goal]
    }));
  };

  const fetchAdvice = async () => {
    if (data.transactions.length === 0) return;
    setLoadingAdvice(true);
    const result = await getFinancialAdvice(data.transactions);
    setAdvice(result || "Maintain your BWP tracking for better insights.");
    setLoadingAdvice(false);
  };

  const isDark = data.theme === 'dark';
  const isPula = data.theme === 'pula';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
      
      {/* Header - Minimalist Glassmorphism */}
      <header className={`sticky top-0 z-40 px-6 py-4 border-b border-transparent transition-all ${isDark ? 'bg-slate-900/80' : 'bg-white/80'} backdrop-blur-xl`}>
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl shadow-sm ${isPula ? 'bg-black' : isDark ? 'bg-sky-500' : 'bg-slate-900'}`}>
              <Banknote className="text-white" size={20} strokeWidth={2.5} />
            </div>
            <div>
               <h1 className={`text-lg font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>PulaBudget</h1>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Botswana</p>
            </div>
          </div>
          
          <button 
            onClick={fetchAdvice}
            disabled={loadingAdvice}
            className={`group relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 text-xs ${isDark ? 'bg-slate-800 text-white' : 'bg-white shadow-sm border border-slate-100 text-slate-800'}`}
          >
            {loadingAdvice ? (
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-sky-500 border-t-transparent" />
            ) : (
              <Sparkles size={14} className="text-sky-500 group-hover:rotate-12 transition-transform" />
            )}
            {loadingAdvice ? 'Processing...' : 'Ask AI Assistant'}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 pb-32">
        {/* AI Insight - Premium Card Style */}
        {advice && (
          <div className="mb-8 p-6 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-sky-600 text-white shadow-xl shadow-sky-500/10 relative overflow-hidden animate-fade-in">
            <div className="absolute -bottom-10 -right-10 opacity-10">
               <Sparkles size={180} />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                   <TrendingUp size={18} />
                </div>
                <button onClick={() => setAdvice('')} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-colors">
                  <X size={14} />
                </button>
              </div>
              <h3 className="font-extrabold text-white mb-2 tracking-tight">Financial Strategist</h3>
              <p className="text-sm font-medium leading-relaxed opacity-90 italic">
                "{advice}"
              </p>
            </div>
          </div>
        )}

        {/* Views */}
        <div className="animate-fade-in">
          {activeTab === 'dashboard' && <Dashboard transactions={data.transactions} limits={data.limits} theme={data.theme} />}
          
          {activeTab === 'transactions' && (
            <div className="space-y-6">
               <div className="flex justify-between items-end">
                  <div>
                    <h2 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Ledger</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction History</p>
                  </div>
                  <button 
                    onClick={() => exportToCSV(data.transactions)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-100 hover:bg-white shadow-sm'}`}
                  >
                    <Download size={14} /> Export CSV
                  </button>
               </div>
               
               <div className={`rounded-[2.5rem] border overflow-hidden shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                  {data.transactions.length === 0 ? (
                    <div className="p-20 text-center space-y-4">
                      <div className="bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto">
                        <History className="text-slate-300" size={32} />
                      </div>
                      <p className="text-slate-400 font-bold text-sm">Quiet month? Add an entry below.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                      {data.transactions.map((t) => {
                        const cat = (t.type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).find(c => c.id === t.category);
                        return (
                          <div key={t.id} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat?.color}15`, color: cat?.color }}>
                                {getIcon(cat?.icon || 'HelpCircle', 22)}
                              </div>
                              <div>
                                <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t.title}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.date} • {cat?.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className={`text-sm font-black ${t.type === 'INCOME' ? 'text-emerald-500' : isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                                {t.type === 'INCOME' ? '+' : '-'}P{t.amount.toLocaleString()}
                              </p>
                              <button 
                                onClick={() => deleteTransaction(t.id)}
                                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all md:opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Wealth</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Savings Goals</p>
                </div>
                <button 
                  onClick={() => {
                    const title = prompt("Target Name (e.g. Dream House)?");
                    const amount = prompt("Amount in BWP?");
                    if(title && amount) handleAddGoal({
                      id: Date.now().toString(),
                      title,
                      targetAmount: Number(amount),
                      currentAmount: 0
                    });
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all hover:scale-105 ${isPula ? 'bg-black text-white' : 'bg-sky-500 text-white'}`}
                >
                  <Plus size={16} strokeWidth={3} /> New Goal
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.goals.map(goal => {
                  const percent = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
                  return (
                    <div key={goal.id} className={`p-8 rounded-[2.5rem] border shadow-sm transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <h4 className="font-black text-lg tracking-tight">{goal.title}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">P{goal.currentAmount.toLocaleString()} saved of P{goal.targetAmount.toLocaleString()}</p>
                        </div>
                        <div className={`text-xs font-black px-3 py-1 rounded-full ${percent >= 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-sky-50 text-sky-600'}`}>{Math.round(percent)}%</div>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden mb-8">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${isPula ? 'bg-black' : 'bg-sky-500'}`} 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex gap-3">
                        <button 
                           onClick={() => {
                             const add = prompt("Add funds (BWP):");
                             if (add) {
                               setData(prev => ({
                                 ...prev,
                                 goals: prev.goals.map(g => g.id === goal.id ? {...g, currentAmount: g.currentAmount + Number(add)} : g)
                               }));
                             }
                           }}
                           className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] ${isDark ? 'bg-slate-700 text-white' : 'bg-slate-900 text-white'}`}
                        >
                          Contribute
                        </button>
                        <button 
                           onClick={() => setData(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== goal.id) }))}
                           className="px-4 py-3 bg-rose-50 text-rose-600 rounded-2xl transition-colors hover:bg-rose-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {data.goals.length === 0 && (
                  <div className="md:col-span-2 p-20 text-center rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700 space-y-4">
                     <Target className="mx-auto text-slate-200" size={48} />
                     <p className="text-slate-400 font-bold text-sm">Saving for school fees or a new car? Set a goal here.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto space-y-8 animate-fade-in">
              <div>
                <h2 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Preferences</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Configuration & Display</p>
              </div>
              
              <div className={`p-8 rounded-[2.5rem] border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                <h3 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-400">Budget Thresholds (BWP)</h3>
                <div className="space-y-4">
                  {EXPENSE_CATEGORIES.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-700/50" style={{ color: cat.color }}>{getIcon(cat.icon, 16)}</div>
                        <span className="text-xs font-bold">{cat.name}</span>
                      </div>
                      <input 
                        type="number"
                        placeholder="Unlimited"
                        value={data.limits.find(l => l.category === cat.id)?.limit || ''}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setData(prev => {
                            const filtered = prev.limits.filter(l => l.category !== cat.id);
                            return {
                              ...prev,
                              limits: val > 0 ? [...filtered, { category: cat.id, limit: val }] : filtered
                            };
                          });
                        }}
                        className={`w-28 text-right bg-slate-50 dark:bg-slate-700/30 border border-transparent rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-sky-500 transition-all`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={`p-8 rounded-[2.5rem] border shadow-sm flex items-center justify-between ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">Visual Theme</h4>
                  <p className="text-[10px] font-bold opacity-60">App appearance</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-2xl">
                  {['light', 'dark', 'pula'].map(t => (
                    <button 
                      key={t}
                      onClick={() => setData(prev => ({...prev, theme: t as any}))}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${data.theme === t ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Executive Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
        <div className={`glass shadow-2xl rounded-[2.5rem] border p-2 flex items-center justify-between transition-colors ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-3xl transition-all ${activeTab === 'dashboard' ? 'bg-slate-100 dark:bg-slate-700 text-sky-600' : 'text-slate-400'}`}
          >
            <LayoutDashboard size={20} strokeWidth={activeTab === 'dashboard' ? 3 : 2} />
          </button>
          
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-3xl transition-all ${activeTab === 'transactions' ? 'bg-slate-100 dark:bg-slate-700 text-sky-600' : 'text-slate-400'}`}
          >
            <History size={20} strokeWidth={activeTab === 'transactions' ? 3 : 2} />
          </button>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className={`w-14 h-14 flex items-center justify-center rounded-[1.7rem] shadow-lg shadow-sky-500/20 active:scale-90 transition-all ${isPula ? 'bg-black text-white' : 'bg-sky-500 text-white'}`}
          >
            <Plus size={28} strokeWidth={3} />
          </button>

          <button 
            onClick={() => setActiveTab('goals')}
            className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-3xl transition-all ${activeTab === 'goals' ? 'bg-slate-100 dark:bg-slate-700 text-sky-600' : 'text-slate-400'}`}
          >
            <Target size={20} strokeWidth={activeTab === 'goals' ? 3 : 2} />
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-3xl transition-all ${activeTab === 'settings' ? 'bg-slate-100 dark:bg-slate-700 text-sky-600' : 'text-slate-400'}`}
          >
            <SettingsIcon size={20} strokeWidth={activeTab === 'settings' ? 3 : 2} />
          </button>
        </div>
      </nav>

      {/* Modern Add Transaction Sheet */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-end md:items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className={`w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-500 overflow-hidden relative ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <h2 className="text-xl font-black tracking-tight">Financial Input</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Entry</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-slate-600 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <TransactionForm onAdd={handleAddTransaction} theme={data.theme} />
          </div>
        </div>
      )}
    </div>
  );
};

const TransactionForm: React.FC<{ onAdd: (t: Transaction) => void; theme: string }> = ({ onAdd, theme }) => {
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [conversionModal, setConversionModal] = useState(false);
  const [foreignAmount, setForeignAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'ZAR'>('ZAR');

  const categories = type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const isDark = theme === 'dark';
  const isPula = theme === 'pula';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !category) return;
    onAdd({
      id: Date.now().toString(),
      title,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toLocaleDateString('en-GB'),
      currency: 'BWP'
    });
  };

  const handleConvert = () => {
    const rate = EXCHANGE_RATES[currency];
    const converted = parseFloat(foreignAmount) * rate;
    setAmount(converted.toFixed(2));
    setConversionModal(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-700 rounded-2xl">
        <button 
          type="button" 
          onClick={() => setType('EXPENSE')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'EXPENSE' ? 'bg-white dark:bg-slate-800 shadow-sm text-rose-500' : 'text-slate-400'}`}
        >
          Expense
        </button>
        <button 
          type="button" 
          onClick={() => setType('INCOME')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'INCOME' ? 'bg-white dark:bg-slate-800 shadow-sm text-emerald-500' : 'text-slate-400'}`}
        >
          Income
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block mb-2">Descriptor</label>
          <input 
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={`w-full p-5 rounded-2xl font-bold text-sm outline-none border transition-all ${isDark ? 'bg-slate-700 border-slate-600 focus:border-sky-500 text-white' : 'bg-slate-50 border-transparent focus:bg-white focus:border-sky-500 text-slate-900'}`} 
            placeholder="e.g. Sefalana Groceries"
          />
        </div>

        <div className="relative">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block mb-2">Value (BWP)</label>
          <div className="flex items-center">
            <input 
              type="number"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className={`w-full p-5 rounded-2xl font-black text-3xl outline-none border transition-all ${isDark ? 'bg-slate-700 border-slate-600 focus:border-sky-500 text-white' : 'bg-slate-50 border-transparent focus:bg-white focus:border-sky-500 text-slate-900'}`} 
              placeholder="0.00"
            />
            <button 
              type="button"
              onClick={() => setConversionModal(true)}
              className="absolute right-5 bg-sky-500/10 text-sky-500 text-[10px] font-black px-4 py-2 rounded-xl transition-all hover:bg-sky-500/20 uppercase tracking-widest"
            >
              FX Tools
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block mb-3">Classification</label>
          <div className="grid grid-cols-4 gap-3 max-h-[160px] overflow-y-auto no-scrollbar pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${category === cat.id ? 'border-sky-500 bg-sky-50 dark:bg-sky-500/10 text-sky-600' : 'border-slate-50 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 text-slate-400 hover:border-slate-200 dark:hover:border-slate-600'}`}
              >
                <div style={{ color: category === cat.id ? 'inherit' : cat.color }}>
                  {getIcon(cat.icon, 20)}
                </div>
                <span className="text-[9px] font-black truncate w-full text-center uppercase tracking-tighter">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button 
        type="submit"
        className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl ${isPula ? 'bg-black text-white shadow-black/10' : 'bg-sky-500 text-white shadow-sky-500/10'}`}
      >
        Authorize Entry
      </button>

      {/* FX Modal */}
      {conversionModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-6 z-[120] backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
             <div className="flex justify-between items-center mb-6">
                <div className="space-y-1">
                   <h3 className="font-black text-lg">FX Conversion</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate Calculator</p>
                </div>
                <button type="button" onClick={() => setConversionModal(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><X size={16} /></button>
             </div>
             <div className="space-y-6">
                <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-700 rounded-2xl">
                   {['ZAR', 'USD'].map(curr => (
                     <button 
                      key={curr}
                      type="button"
                      onClick={() => setCurrency(curr as any)}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${currency === curr ? 'bg-white dark:bg-slate-800 shadow-sm text-sky-500' : 'text-slate-400'}`}
                     >
                       {curr}
                     </button>
                   ))}
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block mb-2">Foreign Value</label>
                   <input 
                     type="number" 
                     value={foreignAmount}
                     onChange={e => setForeignAmount(e.target.value)}
                     className={`w-full p-5 rounded-2xl font-black text-2xl outline-none border transition-all ${isDark ? 'bg-slate-700 border-slate-600 focus:border-sky-500 text-white' : 'bg-slate-50 border-transparent focus:bg-white focus:border-sky-500 text-slate-900'}`}
                     placeholder={`0.00 ${currency}`}
                   />
                </div>
                <button 
                  type="button"
                  onClick={handleConvert}
                  className={`w-full py-5 rounded-3xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] shadow-lg ${isPula ? 'bg-black text-white' : 'bg-sky-500 text-white'}`}
                >
                  Confirm BWP
                </button>
             </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default App;
