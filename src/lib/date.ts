export const toISODate = (date: Date): string => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const parseISODate = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (iso: string, days: number): string => {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
};

export const compareISODate = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

export const isLeapYear = (year: number): boolean => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

export const endOfMonthDay = (year: number, month1to12: number): number => {
  if ([1, 3, 5, 7, 8, 10, 12].includes(month1to12)) return 31;
  if ([4, 6, 9, 11].includes(month1to12)) return 30;
  return isLeapYear(year) ? 29 : 28;
};

export const daysDiffInclusive = (startISO: string, endExclusiveISO: string): number => {
  const ms = parseISODate(endExclusiveISO).getTime() - parseISODate(startISO).getTime();
  const diff = Math.floor(ms / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
};
