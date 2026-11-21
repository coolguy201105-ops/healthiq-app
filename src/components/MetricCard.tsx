import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from './theme';

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  accent?: string;
}

export function MetricCard({ label, value, unit, trend, accent }: Props) {
  const trendColor =
    trend === 'up' ? colors.green : trend === 'down' ? colors.red : colors.textSecondary;
  const trendArrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '';

  return (
    <View style={[styles.card, accent ? { borderLeftColor: accent, borderLeftWidth: 3 } : {}]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Text style={styles.value}>{value}</Text>
        {unit && <Text style={styles.unit}> {unit}</Text>}
        {trendArrow ? <Text style={[styles.trend, { color: trendColor }]}> {trendArrow}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  unit: {
    fontSize: 13,
    color: colors.textSecondary,
    alignSelf: 'flex-end',
    marginBottom: 3,
  },
  trend: {
    fontSize: 16,
    alignSelf: 'flex-end',
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});
