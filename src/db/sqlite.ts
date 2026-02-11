import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('budget-copilot.db');

export const initDb = async (): Promise<void> => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS incomes (
      id TEXT PRIMARY KEY NOT NULL,
      date TEXT NOT NULL,
      amount INTEGER NOT NULL,
      note TEXT
    );
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY NOT NULL,
      date TEXT NOT NULL,
      amount INTEGER NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      paymentType TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS obligations (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      amount INTEGER NOT NULL,
      dueDate TEXT NOT NULL,
      isPaid INTEGER NOT NULL,
      recurrence TEXT NOT NULL
    );
  `);
};
