# Budget Copilot (MVP)

Мобильное приложение на **React Native + Expo** для личного бюджета с локальным хранением.

## Что умеет MVP
- Добавление трат и поступлений.
- Автоматический расчёт периода между поступлениями по расписанию **5 / 15 / 30(31)**.
- Дневной лимит с rollover (перенос остатка/перерасхода).
- Учёт обязательств внутри текущего периода.
- Локальное хранение:
  - `expo-sqlite` для incomes/expenses/obligations.
  - `AsyncStorage` для settings.
- Seed данных обязательств при первом запуске.

## Стек
- Expo SDK 51 + TypeScript
- React Navigation (native stack)
- expo-sqlite
- AsyncStorage

## Запуск локально / Replit
```bash
npm install
npx expo start
```

Далее открыть:
- iOS simulator (`i`),
- Android emulator (`a`),
- Expo Go на телефоне (QR).

## Структура
```
src/
  db/
  lib/
  screens/
  components/
  types/
```

## Важная логика
- `src/lib/budgetEngine.ts` — чистые функции расчёта бюджета и rollover.
- `src/db/sqlite.ts` — инициализация таблиц SQLite.
- `src/db/repository.ts` — CRUD + seed + settings.
