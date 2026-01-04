
import { AppData } from '../types';

const STORAGE_KEY = 'pulabudget_data';

export const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadData = (): AppData | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const exportToCSV = (transactions: any[]) => {
  const headers = ['Date', 'Title', 'Type', 'Category', 'Amount (BWP)'];
  const rows = transactions.map(t => [
    t.date,
    t.title,
    t.type,
    t.category,
    t.amount.toFixed(2)
  ]);

  const csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(",") + "\n"
    + rows.map(e => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `pula_budget_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
