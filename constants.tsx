
import React from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  ShoppingBag, 
  Fuel, 
  Home, 
  Zap, 
  Smartphone, 
  Car, 
  Utensils, 
  Gift, 
  HeartPulse, 
  Coffee,
  HelpCircle
} from 'lucide-react';
import { Category } from './types';

export const THEME_COLORS = {
  pula: {
    primary: '#00ADEF', // Botswana Blue
    secondary: '#000000',
    accent: '#FFFFFF',
    bg: '#F8FAFC'
  },
  light: {
    primary: '#0F172A',
    secondary: '#334155',
    accent: '#3B82F6',
    bg: '#F8FAFC'
  },
  dark: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    accent: '#38BDF8',
    bg: '#0F172A'
  }
};

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', icon: 'Briefcase', color: '#059669' },
  { id: 'business', name: 'Business', icon: 'TrendingUp', color: '#2563EB' },
  { id: 'freelance', name: 'Freelance', icon: 'Briefcase', color: '#7C3AED' },
  { id: 'gift_in', name: 'Gifts', icon: 'Gift', color: '#DB2777' },
  { id: 'other_in', name: 'Other', icon: 'HelpCircle', color: '#475569' },
];

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'groceries', name: 'Groceries', icon: 'ShoppingBag', color: '#D97706' },
  { id: 'fuel', name: 'Fuel', icon: 'Fuel', color: '#DC2626' },
  { id: 'rent', name: 'Rent/Mortgage', icon: 'Home', color: '#059669' },
  { id: 'utilities', name: 'Utilities', icon: 'Zap', color: '#2563EB' },
  { id: 'airtime', name: 'Airtime/Data', icon: 'Smartphone', color: '#7C3AED' },
  { id: 'transport', name: 'Transport', icon: 'Car', color: '#4F46E5' },
  { id: 'dining', name: 'Dining Out', icon: 'Utensils', color: '#E11D48' },
  { id: 'health', name: 'Health', icon: 'HeartPulse', color: '#0D9488' },
  { id: 'leisure', name: 'Leisure', icon: 'Coffee', color: '#EA580C' },
  { id: 'other_ex', name: 'Other', icon: 'HelpCircle', color: '#475569' },
];

export const getIcon = (iconName: string, size = 20) => {
  switch (iconName) {
    case 'Briefcase': return <Briefcase size={size} />;
    case 'TrendingUp': return <TrendingUp size={size} />;
    case 'ShoppingBag': return <ShoppingBag size={size} />;
    case 'Fuel': return <Fuel size={size} />;
    case 'Home': return <Home size={size} />;
    case 'Zap': return <Zap size={size} />;
    case 'Smartphone': return <Smartphone size={size} />;
    case 'Car': return <Car size={size} />;
    case 'Utensils': return <Utensils size={size} />;
    case 'Gift': return <Gift size={size} />;
    case 'HeartPulse': return <HeartPulse size={size} />;
    case 'Coffee': return <Coffee size={size} />;
    default: return <HelpCircle size={size} />;
  }
};

export const EXCHANGE_RATES: Record<string, number> = {
  BWP: 1,
  ZAR: 0.72,
  USD: 13.55
};
