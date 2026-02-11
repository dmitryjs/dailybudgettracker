import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useBudget } from '../lib/budgetContext';
import { Card, PrimaryButton, Screen, SectionTitle, StatRow, formatRub } from '../components/ui';

export const DashboardScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'Dashboard'>> = ({ navigation }) => {
  const { summary, loading, settings } = useBudget();

  if (loading || !summary) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text>Загрузка...</Text>
        </View>
      </Screen>
    );
  }

  const danger = summary.status === 'overspent';

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={[styles.limitCard, danger ? styles.limitCardDanger : null]}>
          <Text style={styles.limitLabel}>Лимит на сегодня</Text>
          <Text style={styles.limitValue}>{formatRub(summary.todayLimit)}</Text>
          <StatRow label="Потрачено" value={formatRub(summary.todaySpent)} />
          <StatRow label="Осталось" value={formatRub(Math.max(0, summary.todayRemaining))} highlight />
          <View style={[styles.statusBadge, danger ? styles.badgeDanger : styles.badgeGood]}>
            <Text style={styles.statusText}>{danger ? 'Перерасход' : 'В пределах лимита'}</Text>
          </View>
        </Card>

        <SectionTitle title="Период" />
        <Card>
          <StatRow label="Следующий доход" value={`${summary.nextIncomeDate} (${summary.daysUntilIncome} дн.)`} />
          <StatRow label="Остаток на период" value={formatRub(summary.remainingInPeriod)} />
          <StatRow label="Буфер" value={formatRub(settings.targetBuffer)} />
          <StatRow label="Базовый дневной лимит" value={formatRub(summary.baseDailyLimit)} />
        </Card>

        <SectionTitle title="Ближайшие обязательства" />
        <Card subtitle="До следующего поступления">
          {summary.plannedObligationsWithinPeriod.length === 0 ? (
            <Text style={styles.muted}>Нет обязательств до конца периода.</Text>
          ) : (
            summary.plannedObligationsWithinPeriod.slice(0, 5).map((o) => (
              <View key={o.id} style={styles.obligationRow}>
                <Text style={styles.obligationTitle}>{o.title}</Text>
                <Text style={styles.obligationMeta}>{formatRub(o.amount)} • {o.dueDate}</Text>
              </View>
            ))
          )}
        </Card>

        <SectionTitle title="Действия" />
        <PrimaryButton title="+ Добавить трату" onPress={() => navigation.navigate('AddExpense')} />
        <PrimaryButton title="+ Добавить поступление" onPress={() => navigation.navigate('AddIncome')} />
        <PrimaryButton title="Обязательства" variant="muted" onPress={() => navigation.navigate('Obligations')} />
        <PrimaryButton title="История" variant="muted" onPress={() => navigation.navigate('History')} />
        <PrimaryButton title="Настройки" variant="muted" onPress={() => navigation.navigate('Settings')} />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: { padding: 14, paddingBottom: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  limitCard: { backgroundColor: '#f8fbff' },
  limitCardDanger: { backgroundColor: '#fff7f8', borderColor: '#ffd7df' },
  limitLabel: { fontSize: 15, fontWeight: '700', color: '#385073' },
  limitValue: { fontSize: 38, fontWeight: '900', color: '#16213f', marginVertical: 8 },
  statusBadge: { alignSelf: 'flex-start', borderRadius: 999, marginTop: 10, paddingHorizontal: 10, paddingVertical: 5 },
  badgeGood: { backgroundColor: '#e6f8eb' },
  badgeDanger: { backgroundColor: '#ffe8ec' },
  statusText: { fontWeight: '700', color: '#21324a' },
  muted: { color: '#6e7a8f' },
  obligationRow: { borderTopWidth: 1, borderTopColor: '#edf1f6', paddingTop: 10, marginTop: 10 },
  obligationTitle: { fontWeight: '700', color: '#1d2b45' },
  obligationMeta: { color: '#6d7a90', marginTop: 2 }
});
