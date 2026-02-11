import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useBudget } from '../lib/budgetContext';
import { Card, PrimaryButton, Screen, SectionTitle, formatRub } from '../components/ui';

export const HistoryScreen: React.FC = () => {
  const { expenses, removeExpense, summary } = useBudget();

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 14 }}>
        <SectionTitle title="Дневные срезы" />
        {(summary?.dayBreakdowns ?? []).slice().reverse().map((d) => (
          <Card key={d.date} title={d.date}>
            <Text style={{ color: '#4f5c72' }}>
              Лимит: {formatRub(d.dayLimit)} • Потрачено: {formatRub(d.spent)} • Перенос: {formatRub(d.rolloverToNext)}
            </Text>
          </Card>
        ))}

        <SectionTitle title="Все траты" />
        {expenses.map((e) => (
          <Card key={e.id}>
            <Text style={{ fontWeight: '700', color: '#1d2b45' }}>{formatRub(e.amount)} • {e.category}</Text>
            <Text style={{ color: '#657289', marginTop: 2 }}>{e.date} • {e.paymentType} {e.description ? `• ${e.description}` : ''}</Text>
            <PrimaryButton title="Удалить" onPress={() => removeExpense(e.id)} variant="danger" />
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
};
