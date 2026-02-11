import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  StyleProp
} from 'react-native';

export const formatRub = (value: number): string => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;

export const Screen: React.FC<React.PropsWithChildren> = ({ children }) => (
  <View style={styles.screen}>{children}</View>
);

export const Card: React.FC<React.PropsWithChildren<{ title?: string; subtitle?: string; style?: StyleProp<ViewStyle> }>> = ({
  title,
  subtitle,
  style,
  children
}) => (
  <View style={[styles.card, style]}>
    {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
    {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
    {children}
  </View>
);

export const StatRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <View style={styles.statRow}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, highlight ? styles.statHighlight : null]}>{value}</Text>
  </View>
);

export const Field: React.FC<TextInputProps & { label: string }> = ({ label, ...props }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} placeholderTextColor="#8e98a7" {...props} />
  </View>
);

export const SectionTitle: React.FC<{ title: string }> = ({ title }) => <Text style={styles.sectionTitle}>{title}</Text>;

export const PrimaryButton: React.FC<{
  title: string;
  onPress: () => void;
  variant?: 'default' | 'danger' | 'muted';
}> = ({ title, onPress, variant = 'default' }) => (
  <Pressable
    style={[styles.button, variant === 'danger' ? styles.buttonDanger : null, variant === 'muted' ? styles.buttonMuted : null]}
    onPress={onPress}
  >
    <Text style={[styles.buttonText, variant === 'muted' ? styles.buttonTextMuted : null]}>{title}</Text>
  </Pressable>
);

export const ChipButton: React.FC<{ label: string; active?: boolean; onPress: () => void }> = ({ label, active, onPress }) => (
  <Pressable style={[styles.chip, active ? styles.chipActive : null]} onPress={onPress}>
    <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f2f5fb' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e8edf5'
  },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 3, color: '#18243d' },
  cardSubtitle: { fontSize: 13, color: '#67748a', marginBottom: 10 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  statLabel: { color: '#5f6b7d', fontSize: 14 },
  statValue: { color: '#11213f', fontSize: 15, fontWeight: '700' },
  statHighlight: { color: '#2257db' },
  label: { fontSize: 13, marginBottom: 5, color: '#2a3342', fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#d6deea',
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 10,
    fontSize: 16,
    color: '#101828',
    backgroundColor: '#fbfcff'
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#18243d', marginBottom: 8 },
  button: {
    backgroundColor: '#2f6feb',
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 8
  },
  buttonDanger: { backgroundColor: '#d7263d' },
  buttonMuted: { backgroundColor: '#eaf0ff' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  buttonTextMuted: { color: '#2f6feb' },
  chip: {
    borderWidth: 1,
    borderColor: '#d6deea',
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8
  },
  chipActive: { backgroundColor: '#2f6feb', borderColor: '#2f6feb' },
  chipText: { color: '#3a4658', fontWeight: '600' },
  chipTextActive: { color: '#fff' }
});
