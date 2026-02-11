import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { db } from './sqlite';
import { Expense, IncomeEvent, Obligation, Settings } from '../types';
import { addDays, toISODate } from '../lib/date';

const SETTINGS_KEY = 'budget_copilot_settings_v1';

export const defaultSettings: Settings = {
  currency: 'RUB',
  targetBuffer: 20000,
  rolloverEnabled: true,
  roundingRule: 'floor_to_100',
  categories: ['еда', 'доставка', 'транспорт', 'дом', 'ребёнок', 'здоровье', 'подарки', 'прочее']
};

const currentMonthDate = (day: number): string => {
  const now = new Date();
  return toISODate(new Date(now.getFullYear(), now.getMonth(), day));
};

export const seedInitialData = async (): Promise<void> => {
  const hasSeed = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM obligations;');
  if ((hasSeed?.count ?? 0) > 0) return;

  const seed: Omit<Obligation, 'id' | 'isPaid'>[] = [
    { title: 'Аренда', amount: 90000, dueDate: currentMonthDate(15), recurrence: 'monthly' },
    { title: 'Кредит', amount: 38600, dueDate: currentMonthDate(26), recurrence: 'monthly' },
    { title: 'КУ', amount: 15000, dueDate: currentMonthDate(15), recurrence: 'monthly' },
    { title: 'ЗП жене', amount: 50000, dueDate: currentMonthDate(5), recurrence: 'monthly' },
    { title: 'ИП (разовый)', amount: 55000, dueDate: addDays(toISODate(new Date()), 3), recurrence: 'one_time' }
  ];

  for (const row of seed) {
    await db.runAsync(
      'INSERT INTO obligations (id, title, amount, dueDate, isPaid, recurrence) VALUES (?, ?, ?, ?, ?, ?);',
      [uuidv4(), row.title, row.amount, row.dueDate, 0, row.recurrence]
    );
  }

  const existingSettings = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!existingSettings) {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
  }
};

export const getIncomes = async (): Promise<IncomeEvent[]> => db.getAllAsync<IncomeEvent>('SELECT * FROM incomes ORDER BY date DESC;');

export const getExpenses = async (): Promise<Expense[]> => db.getAllAsync<Expense>('SELECT * FROM expenses ORDER BY date DESC;');

interface DbObligationRow {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  isPaid: number;
  recurrence: 'monthly' | 'one_time';
}

export const getObligations = async (): Promise<Obligation[]> => {
  const rows = await db.getAllAsync<DbObligationRow>('SELECT * FROM obligations ORDER BY dueDate ASC;');
  return rows.map((r) => ({ ...r, isPaid: Boolean(r.isPaid) }));
};

export const createIncome = async (payload: Omit<IncomeEvent, 'id'>): Promise<void> => {
  await db.runAsync('INSERT INTO incomes (id, date, amount, note) VALUES (?, ?, ?, ?);', [uuidv4(), payload.date, payload.amount, payload.note ?? null]);
};

export const createExpense = async (payload: Omit<Expense, 'id'>): Promise<void> => {
  await db.runAsync('INSERT INTO expenses (id, date, amount, category, description, paymentType) VALUES (?, ?, ?, ?, ?, ?);', [
    uuidv4(),
    payload.date,
    payload.amount,
    payload.category,
    payload.description ?? null,
    payload.paymentType
  ]);
};

export const createObligation = async (payload: Omit<Obligation, 'id'>): Promise<void> => {
  await db.runAsync('INSERT INTO obligations (id, title, amount, dueDate, isPaid, recurrence) VALUES (?, ?, ?, ?, ?, ?);', [
    uuidv4(),
    payload.title,
    payload.amount,
    payload.dueDate,
    payload.isPaid ? 1 : 0,
    payload.recurrence
  ]);
};

export const updateObligationPaid = async (id: string, isPaid: boolean): Promise<void> => {
  await db.runAsync('UPDATE obligations SET isPaid = ? WHERE id = ?;', [isPaid ? 1 : 0, id]);
};

export const copyObligationToNextMonth = async (obligation: Obligation): Promise<void> => {
  const date = new Date(obligation.dueDate);
  const nextDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
  await createObligation({
    title: obligation.title,
    amount: obligation.amount,
    dueDate: toISODate(nextDate),
    isPaid: false,
    recurrence: obligation.recurrence
  });
};

export const deleteExpense = async (id: string): Promise<void> => {
  await db.runAsync('DELETE FROM expenses WHERE id = ?;', [id]);
};

export const loadSettings = async (): Promise<Settings> => {
  const data = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!data) return defaultSettings;
  try {
    return { ...defaultSettings, ...JSON.parse(data) };
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = async (settings: Settings): Promise<void> => {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const resetAllData = async (): Promise<void> => {
  await db.execAsync(`DELETE FROM incomes; DELETE FROM expenses; DELETE FROM obligations;`);
  await AsyncStorage.removeItem(SETTINGS_KEY);
  await seedInitialData();
};
