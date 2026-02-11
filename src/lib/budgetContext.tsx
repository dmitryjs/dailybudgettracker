import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  copyObligationToNextMonth,
  createExpense,
  createIncome,
  createObligation,
  defaultSettings,
  deleteExpense,
  getExpenses,
  getIncomes,
  getObligations,
  loadSettings,
  resetAllData,
  saveSettings,
  seedInitialData,
  updateObligationPaid
} from '../db/repository';
import { initDb } from '../db/sqlite';
import { calculateBudgetSummary } from './budgetEngine';
import { BudgetSummary, Expense, IncomeEvent, Obligation, Settings } from '../types';

interface BudgetContextValue {
  loading: boolean;
  incomes: IncomeEvent[];
  expenses: Expense[];
  obligations: Obligation[];
  settings: Settings;
  summary: BudgetSummary | null;
  refresh: () => Promise<void>;
  addIncome: (payload: Omit<IncomeEvent, 'id'>) => Promise<void>;
  addExpense: (payload: Omit<Expense, 'id'>) => Promise<void>;
  addObligation: (payload: Omit<Obligation, 'id'>) => Promise<void>;
  toggleObligationPaid: (id: string, isPaid: boolean) => Promise<void>;
  cloneObligationNextMonth: (obligation: Obligation) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  updateSettings: (settings: Settings) => Promise<void>;
  clearAll: () => Promise<void>;
}

const BudgetContext = createContext<BudgetContextValue | undefined>(undefined);

export const BudgetProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [incomes, setIncomes] = useState<IncomeEvent[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const refresh = useCallback(async () => {
    const [inc, exp, obl, s] = await Promise.all([getIncomes(), getExpenses(), getObligations(), loadSettings()]);
    setIncomes(inc);
    setExpenses(exp);
    setObligations(obl);
    setSettings(s);
  }, []);

  useEffect(() => {
    (async () => {
      await initDb();
      await seedInitialData();
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const withRefresh = async (fn: () => Promise<void>) => {
    await fn();
    await refresh();
  };

  const summary = useMemo(() => calculateBudgetSummary({ incomes, expenses, obligations, settings }), [incomes, expenses, obligations, settings]);

  const value: BudgetContextValue = {
    loading,
    incomes,
    expenses,
    obligations,
    settings,
    summary,
    refresh,
    addIncome: (payload) => withRefresh(() => createIncome(payload)),
    addExpense: (payload) => withRefresh(() => createExpense(payload)),
    addObligation: (payload) => withRefresh(() => createObligation(payload)),
    toggleObligationPaid: (id, isPaid) => withRefresh(() => updateObligationPaid(id, isPaid)),
    cloneObligationNextMonth: (obligation) => withRefresh(() => copyObligationToNextMonth(obligation)),
    removeExpense: (id) => withRefresh(() => deleteExpense(id)),
    updateSettings: async (next) => {
      await saveSettings(next);
      await refresh();
    },
    clearAll: () => withRefresh(() => resetAllData())
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
};

export const useBudget = (): BudgetContextValue => {
  const ctx = useContext(BudgetContext);
  if (!ctx) {
    throw new Error('useBudget must be used within BudgetProvider');
  }
  return ctx;
};
