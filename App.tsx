
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  Target, 
  Settings as SettingsIcon, 
  Download,
  X,
  Plus,
  Trash2,
  ChevronRight,
  Banknote,
  ShieldCheck,
  CloudOff,
  RefreshCw,
  Globe,
  Edit3,
  ExternalLink
} from 'lucide-react';
import { 
  Transaction, 
  SavingsGoal, 
  AppData, 
  TransactionType,
  ExchangeRates
} from './types';
import { 
  getIcon, 
  EXCHANGE_RATES as DEFAULT_RATES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES
} from './constants';
import { saveData, loadData, exportToCSV } from './services/storage';
import Dashboard from './components/Dashboard';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'goals' | 'settings'>('dashboard');
  const [data, setData] = useState<AppData>({
    transactions: [],
    goals: [],
    limits: [],
    theme: 'pula',
    exchangeRates: DEFAULT_RATES
  });
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const saved = loadData();
    if (saved) {
      // Fix: Ensure exchangeRates is typed correctly by using DEFAULT_RATES (which is now ExchangeRates)
      setData({
        ...saved,
        exchangeRates: saved.exchangeRates || DEFAULT_RATES
      });
    }
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

  const updateRates = (newRates: ExchangeRates) => {
    setData(prev => ({
      ...prev,
      exchangeRates: newRates
    }));
  };

  const isDark = data.theme === 'dark';
  const isPula = data.theme === 'pula';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
      
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
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full">
              <ShieldCheck size={12} />
              <span className="text-[10px] font-black uppercase tracking-widest">Local-Only</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 pb-32">
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
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto space-y-8 animate-fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Preferences</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Configuration & Display</p>
                </div>
                <div className="bg-slate-900/5 dark:bg-white/5 p-4 rounded-3xl flex items-center gap-3 border border-slate-200 dark:border-slate-700">
                  <CloudOff className="text-sky-500" size={20} />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-widest">Offline Ready</p>
                    <p className="text-[9px] text-slate-400 font-medium">Data stored on device</p>
                  </div>
                </div>
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

              <div className={`p-8 rounded-[2.5rem] border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Global FX Rates</h3>
                   <span className="text-[10px] font-black text-sky-500">BWP BASE</span>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">ZAR/BWP</span>
                      <input 
                        type="number" 
                        step="0.01"
                        value={data.exchangeRates.ZAR}
                        onChange={(e) => updateRates({ ...data.exchangeRates, ZAR: Number(e.target.value) })}
                        className="w-24 text-right bg-slate-50 dark:bg-slate-700/30 rounded-xl px-4 py-2 text-xs font-bold outline-none"
                      />
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">USD/BWP</span>
                      <input 
                        type="number" 
                        step="0.01"
                        value={data.exchangeRates.USD}
                        onChange={(e) => updateRates({ ...data.exchangeRates, USD: Number(e.target.value) })}
                        className="w-24 text-right bg-slate-50 dark:bg-slate-700/30 rounded-xl px-4 py-2 text-xs font-bold outline-none"
                      />
                   </div>
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

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
        <div className={`glass shadow-2xl rounded-[2.5rem] border p-2 flex items-center justify-between transition-colors ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
          <button onClick={() => setActiveTab('dashboard')} className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-3xl transition-all ${activeTab === 'dashboard' ? 'bg-slate-100 dark:bg-slate-700 text-sky-600' : 'text-slate-400'}`}><LayoutDashboard size={20} /></button>
          <button onClick={() => setActiveTab('transactions')} className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-3xl transition-all ${activeTab === 'transactions' ? 'bg-slate-100 dark:bg-slate-700 text-sky-600' : 'text-slate-400'}`}><History size={20} /></button>
          <button onClick={() => setShowAddModal(true)} className={`w-14 h-14 flex items-center justify-center rounded-[1.7rem] shadow-lg shadow-sky-500/20 active:scale-90 transition-all ${isPula ? 'bg-black text-white' : 'bg-sky-500 text-white'}`}><Plus size={28} /></button>
          <button onClick={() => setActiveTab('goals')} className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-3xl transition-all ${activeTab === 'goals' ? 'bg-slate-100 dark:bg-slate-700 text-sky-600' : 'text-slate-400'}`}><Target size={20} /></button>
          <button onClick={() => setActiveTab('settings')} className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-3xl transition-all ${activeTab === 'settings' ? 'bg-slate-100 dark:bg-slate-700 text-sky-600' : 'text-slate-400'}`}><SettingsIcon size={20} /></button>
        </div>
      </nav>

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
            <TransactionForm onAdd={handleAddTransaction} theme={data.theme} initialRates={data.exchangeRates} onUpdateRates={updateRates} />
          </div>
        </div>
      )}
    </div>
  );
};

const TransactionForm: React.FC<{ 
  onAdd: (t: Transaction) => void; 
  theme: string; 
  initialRates: ExchangeRates;
  onUpdateRates: (rates: ExchangeRates) => void;
}> = ({ onAdd, theme, initialRates, onUpdateRates }) => {
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  
  const [conversionModal, setConversionModal] = useState(false);
  const [foreignAmount, setForeignAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'ZAR'>('ZAR');
  const [localRates, setLocalRates] = useState<ExchangeRates>(initialRates);
  const [isEditingRates, setIsEditingRates] = useState(false);
  const [isFetchingRates, setIsFetchingRates] = useState(false);
  const [searchSources, setSearchSources] = useState<{uri: string, title: string}[]>([]);

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
    const rate = localRates[currency];
    const converted = parseFloat(foreignAmount) * rate;
    setAmount(converted.toFixed(2));
    onUpdateRates(localRates); // Sync rates back to main app state
    setConversionModal(false);
  };

  // Fix: Improved FX rate fetching to follow Gemini API guidelines.
  // One call, extract URLs from groundingChunks, and avoid JSON parsing of search results.
  const fetchOnlineRates = async () => {
    setIsFetchingRates(true);
    setSearchSources([]);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "What is the current exchange rate for 1 USD to BWP and 1 ZAR to BWP? Respond ONLY with 'USD: [rate], ZAR: [rate]'.",
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      
      const text = response.text || "";
      
      // Extract website URLs from groundingChunks as per guidelines
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter(chunk => chunk.web)
        ?.map(chunk => ({ uri: chunk.web!.uri, title: chunk.web!.title })) || [];
      setSearchSources(sources);

      // Parse text manually instead of using JSON.parse on search grounding output
      const usdMatch = text.match(/USD:\s*(\d+\.?\d*)/);
      const zarMatch = text.match(/ZAR:\s*(\d+\.?\d*)/);
      
      if (usdMatch && zarMatch) {
        const newRates = { ...localRates, USD: parseFloat(usdMatch[1]), ZAR: parseFloat(zarMatch[1]) };
        setLocalRates(newRates);
        onUpdateRates(newRates);
      } else {
        throw new Error("Could not parse rates from AI response");
      }
    } catch (e) {
      console.error("Failed to fetch rates", e);
      alert("Could not fetch latest rates. Please check your connection or edit manually.");
    } finally {
      setIsFetchingRates(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-700 rounded-2xl">
        <button type="button" onClick={() => setType('EXPENSE')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'EXPENSE' ? 'bg-white dark:bg-slate-800 shadow-sm text-rose-500' : 'text-slate-400'}`}>Expense</button>
        <button type="button" onClick={() => setType('INCOME')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'INCOME' ? 'bg-white dark:bg-slate-800 shadow-sm text-emerald-500' : 'text-slate-400'}`}>Income</button>
      </div>
      <div className="space-y-5">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block mb-2">Descriptor</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className={`w-full p-5 rounded-2xl font-bold text-sm outline-none border transition-all ${isDark ? 'bg-slate-700 border-slate-600 focus:border-sky-500 text-white' : 'bg-slate-50 border-transparent focus:bg-white focus:border-sky-500 text-slate-900'}`} placeholder="e.g. Sefalana Groceries" />
        </div>
        <div className="relative">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block mb-2">Value (BWP)</label>
          <div className="flex items-center">
            <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className={`w-full p-5 rounded-2xl font-black text-3xl outline-none border transition-all ${isDark ? 'bg-slate-700 border-slate-600 focus:border-sky-500 text-white' : 'bg-slate-50 border-transparent focus:bg-white focus:border-sky-500 text-slate-900'}`} placeholder="0.00" />
            <button type="button" onClick={() => setConversionModal(true)} className="absolute right-5 bg-sky-500/10 text-sky-500 text-[10px] font-black px-4 py-2 rounded-xl transition-all hover:bg-sky-500/20 uppercase tracking-widest">FX Tools</button>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block mb-3">Classification</label>
          <div className="grid grid-cols-4 gap-3 max-h-[160px] overflow-y-auto no-scrollbar pb-2">
            {categories.map(cat => (
              <button key={cat.id} type="button" onClick={() => setCategory(cat.id)} className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${category === cat.id ? 'border-sky-500 bg-sky-50 dark:bg-sky-500/10 text-sky-600' : 'border-slate-50 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 text-slate-400 hover:border-slate-200 dark:hover:border-slate-600'}`}>
                <div style={{ color: category === cat.id ? 'inherit' : cat.color }}>{getIcon(cat.icon, 20)}</div>
                <span className="text-[9px] font-black truncate w-full text-center uppercase tracking-tighter">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <button type="submit" className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl ${isPula ? 'bg-black text-white shadow-black/10' : 'bg-sky-500 text-white shadow-sky-500/10'}`}>Authorize Entry</button>
      
      {conversionModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-6 z-[120] backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
             <div className="flex justify-between items-center mb-6">
                <div className="space-y-1"><h3 className="font-black text-lg">FX Conversion</h3><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate Calculator</p></div>
                <button type="button" onClick={() => setConversionModal(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><X size={16} /></button>
             </div>
             
             <div className="space-y-6">
                <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-700 rounded-2xl">
                   {['ZAR', 'USD'].map(curr => (<button key={curr} type="button" onClick={() => setCurrency(curr as any)} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${currency === curr ? 'bg-white dark:bg-slate-800 shadow-sm text-sky-500' : 'text-slate-400'}`}>{curr}</button>))}
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Rate</span>
                      <div className="flex items-center gap-2">
                         <button type="button" onClick={() => setIsEditingRates(!isEditingRates)} className="text-sky-500 hover:text-sky-600">
                            <Edit3 size={14} />
                         </button>
                         <button type="button" onClick={fetchOnlineRates} disabled={isFetchingRates} className={`text-sky-500 hover:text-sky-600 ${isFetchingRates ? 'animate-spin' : ''}`}>
                            <Globe size={14} />
                         </button>
                      </div>
                   </div>
                   {isEditingRates ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">1 {currency} = </span>
                        <input 
                           type="number" 
                           step="0.01"
                           value={localRates[currency]}
                           onChange={(e) => setLocalRates({...localRates, [currency]: Number(e.target.value)})}
                           className="w-full bg-white dark:bg-slate-800 border-0 rounded-lg px-2 py-1 text-xs font-black outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-sky-500"
                        />
                        <span className="text-xs font-bold text-slate-500">BWP</span>
                      </div>
                   ) : (
                      <p className="text-xs font-black">1 {currency} = <span className="text-sky-500">{localRates[currency]}</span> BWP</p>
                   )}
                </div>

                {searchSources.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Sources</p>
                    <div className="flex flex-col gap-1.5">
                      {searchSources.slice(0, 3).map((source, i) => (
                        <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                          <span className="text-[9px] font-bold truncate max-w-[80%]">{source.title}</span>
                          <ExternalLink size={10} className="text-sky-500" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block mb-2">Foreign Value</label>
                   <input type="number" value={foreignAmount} onChange={e => setForeignAmount(e.target.value)} className={`w-full p-5 rounded-2xl font-black text-2xl outline-none border transition-all ${isDark ? 'bg-slate-700 border-slate-600 focus:border-sky-500 text-white' : 'bg-slate-50 border-transparent focus:bg-white focus:border-sky-500 text-slate-900'}`} placeholder={`0.00 ${currency}`} />
                </div>

                <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/20 text-center">
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1 block">Output Value</span>
                   <p className="text-2xl font-black text-emerald-600">P {(Number(foreignAmount) * localRates[currency]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>

                <button type="button" onClick={handleConvert} className={`w-full py-5 rounded-3xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] shadow-lg ${isPula ? 'bg-black text-white' : 'bg-sky-500 text-white'}`}>Confirm BWP</button>
             </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default App;
