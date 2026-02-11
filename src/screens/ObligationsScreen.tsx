import React, { useState } from 'react';
import { Alert, ScrollView, Switch, Text, View } from 'react-native';
import { useBudget } from '../lib/budgetContext';
import { Card, ChipButton, Field, PrimaryButton, Screen, SectionTitle, formatRub } from '../components/ui';
import { toISODate } from '../lib/date';

export const ObligationsScreen: React.FC = () => {
  const { obligations, addObligation, toggleObligationPaid, cloneObligationNextMonth } = useBudget();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(toISODate(new Date()));
  const [recurrence, setRecurrence] = useState<'monthly' | 'one_time'>('monthly');

  const save = async () => {
    const val = Number(amount);
    if (!title.trim() || !Number.isInteger(val) || val <= 0) {
      Alert.alert('Ошибка', 'Заполните поля корректно');
      return;
    }
    await addObligation({ title: title.trim(), amount: val, dueDate, isPaid: false, recurrence });
    setTitle('');
    setAmount('');
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 14 }}>
        <Card title="Новое обязательство">
          <Field label="Название" value={title} onChangeText={setTitle} />
          <Field label="Сумма (₽)" keyboardType="number-pad" value={amount} onChangeText={setAmount} />
          <Field label="Срок (YYYY-MM-DD)" value={dueDate} onChangeText={setDueDate} />
          <SectionTitle title="Повторяемость" />
          <View style={{ flexDirection: 'row' }}>
            <ChipButton label="Ежемесячно" active={recurrence === 'monthly'} onPress={() => setRecurrence('monthly')} />
            <ChipButton label="Разовый" active={recurrence === 'one_time'} onPress={() => setRecurrence('one_time')} />
          </View>
          <PrimaryButton title="Добавить" onPress={save} />
        </Card>

        {obligations.map((o) => (
          <Card key={o.id}>
            <Text style={{ fontWeight: '800', fontSize: 16, color: '#1b2a42' }}>{o.title}</Text>
            <Text style={{ color: '#637087', marginTop: 3 }}>{formatRub(o.amount)} • {o.dueDate} • {o.recurrence}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
              <Text style={{ color: '#263249', fontWeight: '600' }}>Оплачено</Text>
              <Switch value={o.isPaid} onValueChange={(v) => toggleObligationPaid(o.id, v)} />
            </View>
            <PrimaryButton title="Скопировать на следующий месяц" variant="muted" onPress={() => cloneObligationNextMonth(o)} />
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
};
