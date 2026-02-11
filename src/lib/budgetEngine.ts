import { BudgetSummary, Expense, IncomeEvent, Obligation, RoundingRule, Settings } from '../types';
import { addDays, compareISODate, daysDiffInclusive, endOfMonthDay, toISODate } from './date';

const roundDown = (value: number, rule: RoundingRule): number => {
  if (value <= 0) return 0;
  const divisor = rule === 'floor_to_10' ? 10 : 100;
  return Math.floor(value / divisor) * divisor;
};

export const getNextIncomeDate = (todayISO: string): string => {
  const date = new Date(todayISO);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const mk = (y: number, m: number, d: number) => toISODate(new Date(y, m - 1, d));
  const incomeDaysThisMonth = [5, 15, endOfMonthDay(year, month)];
  const nextDay = incomeDaysThisMonth.find((d) => d > day);
  if (nextDay) return mk(year, month, nextDay);

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  return mk(nextYear, nextMonth, 5);
};

const isWithinInterval = (date: string, startInclusive: string, endExclusive: string): boolean =>
  compareISODate(date, startInclusive) >= 0 && compareISODate(date, endExclusive) < 0;

const sum = (nums: number[]): number => nums.reduce((acc, n) => acc + n, 0);

const buildDayList = (startISO: string, endExclusiveISO: string): string[] => {
  const out: string[] = [];
  let current = startISO;
  while (compareISODate(current, endExclusiveISO) < 0) {
    out.push(current);
    current = addDays(current, 1);
  }
  return out;
};

export const calculateBudgetSummary = ({
  incomes,
  expenses,
  obligations,
  settings,
  today = toISODate(new Date())
}: {
  incomes: IncomeEvent[];
  expenses: Expense[];
  obligations: Obligation[];
  settings: Settings;
  today?: string;
}): BudgetSummary => {
  const nextIncomeDate = getNextIncomeDate(today);
  const latestIncome = incomes
    .filter((i) => compareISODate(i.date, today) <= 0)
    .sort((a, b) => compareISODate(b.date, a.date))[0];

  const periodStartDate = latestIncome?.date ?? today;
  const periodEndDate = nextIncomeDate;

  const plannedObligationsWithinPeriod = obligations.filter(
    (o) => !o.isPaid && isWithinInterval(o.dueDate, today, periodEndDate)
  );

  const totalIncomesInPeriod = sum(incomes.filter((i) => isWithinInterval(i.date, periodStartDate, addDays(today, 1))).map((i) => i.amount));
  const totalExpensesInPeriod = sum(expenses.filter((e) => isWithinInterval(e.date, periodStartDate, addDays(today, 1))).map((e) => e.amount));
  const periodIncomeTotal = sum(incomes.filter((i) => isWithinInterval(i.date, periodStartDate, periodEndDate)).map((i) => i.amount));
  const plannedObligationsAmount = sum(plannedObligationsWithinPeriod.map((o) => o.amount));

  const remainingInPeriod = periodIncomeTotal - totalExpensesInPeriod - plannedObligationsAmount - settings.targetBuffer;
  const remainingDays = daysDiffInclusive(today, periodEndDate);
  const baseDailyLimit = roundDown(Math.floor(remainingInPeriod / remainingDays), settings.roundingRule);

  const allDays = buildDayList(periodStartDate, addDays(today, 1));
  const dayBreakdowns = allDays.map((day) => {
    const dayExpenses = sum(expenses.filter((e) => e.date === day).map((e) => e.amount));
    return {
      date: day,
      baseDailyLimit,
      dayLimit: 0,
      spent: dayExpenses,
      rolloverToNext: 0
    };
  });

  let rollover = 0;
  for (let i = 0; i < dayBreakdowns.length; i += 1) {
    const d = dayBreakdowns[i];
    d.dayLimit = Math.max(0, d.baseDailyLimit + (settings.rolloverEnabled ? rollover : 0));
    d.rolloverToNext = d.dayLimit - d.spent;
    rollover = d.rolloverToNext;
  }

  const todayBreakdown = dayBreakdowns[dayBreakdowns.length - 1] ?? {
    date: today,
    dayLimit: Math.max(0, baseDailyLimit),
    spent: 0,
    rolloverToNext: Math.max(0, baseDailyLimit),
    baseDailyLimit
  };

  const todayRemaining = todayBreakdown.dayLimit - todayBreakdown.spent;

  return {
    today,
    periodStartDate,
    periodEndDate,
    nextIncomeDate,
    daysUntilIncome: daysDiffInclusive(today, periodEndDate),
    remainingInPeriod,
    remainingDays,
    baseDailyLimit,
    todayLimit: todayBreakdown.dayLimit,
    todaySpent: todayBreakdown.spent,
    todayRemaining,
    totalIncomesInPeriod,
    totalExpensesInPeriod,
    plannedObligationsAmount,
    plannedObligationsWithinPeriod,
    status: todayRemaining < 0 || todayBreakdown.rolloverToNext < 0 ? 'overspent' : 'within_limit',
    dayBreakdowns
  };
};
