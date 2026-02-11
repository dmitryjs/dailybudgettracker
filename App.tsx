import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BudgetProvider } from './src/lib/budgetContext';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { AddExpenseScreen } from './src/screens/AddExpenseScreen';
import { AddIncomeScreen } from './src/screens/AddIncomeScreen';
import { ObligationsScreen } from './src/screens/ObligationsScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

export type RootStackParamList = {
  Dashboard: undefined;
  AddExpense: undefined;
  AddIncome: undefined;
  Obligations: undefined;
  History: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f2f5fb'
  }
};

export default function App() {
  return (
    <SafeAreaProvider>
      <BudgetProvider>
        <NavigationContainer theme={navTheme}>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: '#ffffff' },
              headerShadowVisible: false,
              headerTitleStyle: { fontWeight: '700' }
            }}
          >
            <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Budget Copilot' }} />
            <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Добавить трату', presentation: 'modal' }} />
            <Stack.Screen name="AddIncome" component={AddIncomeScreen} options={{ title: 'Добавить поступление', presentation: 'modal' }} />
            <Stack.Screen name="Obligations" component={ObligationsScreen} options={{ title: 'Обязательства' }} />
            <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'История трат' }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Настройки' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </BudgetProvider>
    </SafeAreaProvider>
  );
}
