import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { useBudget } from '../lib/budgetContext';
import { Card, ChipButton, Field, PrimaryButton, Screen } from '../components/ui';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, clearAll } = useBudget();
  const [targetBuffer, setTargetBuffer] = useState(String(settings.targetBuffer));
  const [roundingRule, setRoundingRule] = useState(settings.roundingRule);
  const [categories, setCategories] = useState(settings.categories.join(', '));

  const save = async () => {
    const parsedBuffer = Number(targetBuffer);
    if (!Number.isInteger(parsedBuffer) || parsedBuffer < 0) {
      Alert.alert('Ошибка', 'Буфер должен быть целым числом >= 0');
      return;
    }

    await updateSettings({
      ...settings,
      targetBuffer: parsedBuffer,
      roundingRule: roundingRule === 'floor_to_10' ? 'floor_to_10' : 'floor_to_100',
      categories: categories
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
    });
    Alert.alert('Сохранено');
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 14 }}>
        <Card title="Основные">
          <Field label="Target buffer (₽)" keyboardType="number-pad" value={targetBuffer} onChangeText={setTargetBuffer} />
          <Field label="Категории (через запятую)" value={categories} onChangeText={setCategories} multiline />
          <ChipButton label="Округление до 100" active={roundingRule === 'floor_to_100'} onPress={() => setRoundingRule('floor_to_100')} />
          <ChipButton label="Округление до 10" active={roundingRule === 'floor_to_10'} onPress={() => setRoundingRule('floor_to_10')} />
          <PrimaryButton title="Сохранить настройки" onPress={save} />
        </Card>

        <Card title="Danger zone">
          <PrimaryButton
            title="Сбросить все данные"
            variant="danger"
            onPress={() =>
              Alert.alert('Подтверждение', 'Удалить все локальные данные?', [
                { text: 'Отмена' },
                { text: 'Удалить', style: 'destructive', onPress: () => clearAll() }
              ])
            }
          />
        </Card>
      </ScrollView>
    </Screen>
  );
};
