import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useBudget } from '../lib/budgetContext';
import { Card, Field, PrimaryButton, Screen } from '../components/ui';
import { toISODate } from '../lib/date';

export const AddIncomeScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'AddIncome'>> = ({ navigation }) => {
  const { addIncome } = useBudget();
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(toISODate(new Date()));
  const [note, setNote] = useState('');

  const save = async () => {
    const val = Number(amount);
    if (!Number.isInteger(val) || val <= 0) {
      Alert.alert('Ошибка', 'Введите целое число больше 0');
      return;
    }
    await addIncome({ amount: val, date, note });
    navigation.goBack();
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 14 }}>
        <Card title="Новое поступление" subtitle="Дата по умолчанию — сегодня">
          <Field label="Сумма (₽)" keyboardType="number-pad" value={amount} onChangeText={setAmount} />
          <Field label="Дата (YYYY-MM-DD)" value={date} onChangeText={setDate} />
          <Field label="Заметка" value={note} onChangeText={setNote} />
        </Card>
        <PrimaryButton title="Сохранить поступление" onPress={save} />
      </ScrollView>
    </Screen>
  );
};
