
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  currency: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface BudgetLimit {
  category: string;
  limit: number;
}

export interface ExchangeRates {
  BWP: number;
  ZAR: number;
  USD: number;
}

export interface AppData {
  transactions: Transaction[];
  goals: SavingsGoal[];
  limits: BudgetLimit[];
  theme: 'light' | 'dark' | 'pula';
  exchangeRates: ExchangeRates;
}

export enum Currency {
  BWP = 'BWP',
  ZAR = 'ZAR',
  USD = 'USD'
}
