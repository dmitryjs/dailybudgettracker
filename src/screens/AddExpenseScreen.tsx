import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useBudget } from '../lib/budgetContext';
import { Card, ChipButton, Field, PrimaryButton, Screen, SectionTitle } from '../components/ui';
import { toISODate } from '../lib/date';

export const AddExpenseScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'AddExpense'>> = ({ navigation }) => {
  const { addExpense, settings } = useBudget();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(settings.categories[0] ?? 'прочее');
  const [date, setDate] = useState(toISODate(new Date()));
  const [paymentType, setPaymentType] = useState<'cash' | 'card'>('card');
  const [description, setDescription] = useState('');

  const save = async () => {
    const val = Number(amount);
    if (!Number.isInteger(val) || val <= 0) {
      Alert.alert('Ошибка', 'Введите целое число больше 0');
      return;
    }
    await addExpense({ amount: val, category, date, paymentType, description });
    navigation.goBack();
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 14 }}>
        <Card title="Новая трата" subtitle="Сохранится локально и сразу пересчитает лимит">
          <Field label="Сумма (₽)" keyboardType="number-pad" value={amount} onChangeText={setAmount} />
          <Field label="Дата (YYYY-MM-DD)" value={date} onChangeText={setDate} />
          <Field label="Описание" value={description} onChangeText={setDescription} />

          <SectionTitle title="Категория" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 }}>
            {settings.categories.map((cat) => (
              <ChipButton key={cat} label={cat} active={category === cat} onPress={() => setCategory(cat)} />
            ))}
          </View>

          <SectionTitle title="Тип оплаты" />
          <View style={{ flexDirection: 'row' }}>
            <ChipButton label="Карта" active={paymentType === 'card'} onPress={() => setPaymentType('card')} />
            <ChipButton label="Наличные" active={paymentType === 'cash'} onPress={() => setPaymentType('cash')} />
          </View>
        </Card>

        <PrimaryButton title="Сохранить трату" onPress={save} />
      </ScrollView>
    </Screen>
  );
};
