export type PaymentType = 'cash' | 'card';
export type Recurrence = 'monthly' | 'one_time';
export type RoundingRule = 'floor_to_100' | 'floor_to_10';

export interface IncomeEvent {
  id: string;
  date: string;
  amount: number;
  note?: string;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description?: string;
  paymentType: PaymentType;
}

export interface Obligation {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  recurrence: Recurrence;
}

export interface Settings {
  currency: 'RUB';
  targetBuffer: number;
  rolloverEnabled: boolean;
  roundingRule: RoundingRule;
  categories: string[];
}

export interface DayBreakdown {
  date: string;
  baseDailyLimit: number;
  dayLimit: number;
  spent: number;
  rolloverToNext: number;
}

export interface BudgetSummary {
  today: string;
  periodStartDate: string;
  periodEndDate: string;
  nextIncomeDate: string;
  daysUntilIncome: number;
  remainingInPeriod: number;
  remainingDays: number;
  baseDailyLimit: number;
  todayLimit: number;
  todaySpent: number;
  todayRemaining: number;
  totalIncomesInPeriod: number;
  totalExpensesInPeriod: number;
  plannedObligationsAmount: number;
  plannedObligationsWithinPeriod: Obligation[];
  status: 'within_limit' | 'overspent';
  dayBreakdowns: DayBreakdown[];
}
