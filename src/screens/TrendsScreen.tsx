import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionHeader } from '../components/SectionHeader';
import { colors, spacing, radius } from '../components/theme';
import { useHealthData } from '../hooks/useHealthData';
import { HealthTrendPoint } from '../types';

type Metric = 'heartRate' | 'hrv' | 'steps' | 'sleepHours';

const METRICS: { key: Metric; label: string; unit: string; color: string }[] = [
  { key: 'heartRate', label: 'Heart Rate', unit: 'bpm', color: colors.accentRed },
  { key: 'hrv', label: 'HRV', unit: 'ms', color: colors.accent },
  { key: 'steps', label: 'Steps', unit: '', color: colors.accentGreen },
  { key: 'sleepHours', label: 'Sleep', unit: 'h', color: colors.accentPurple },
];

function SimpleBarChart({ data, metric, color }: { data: HealthTrendPoint[]; metric: Metric; color: string }) {
  const values = data.map((d) => d[metric] as number);
  const max = Math.max(...values);

  return (
    <View style={chart.container}>
      {data.map((d, i) => {
        const pct = max > 0 ? (values[i] / max) * 100 : 0;
        return (
          <View key={d.date} style={chart.barWrapper}>
            <Text style={chart.value}>{values[i]}</Text>
            <View style={chart.barBg}>
              <View style={[chart.barFill, { height: `${pct}%` as any, backgroundColor: color }]} />
            </View>
            <Text style={chart.label}>{d.date.split(' ')[1]}</Text>
          </View>
        );
      })}
    </View>
  );
}

const chart = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', height: 160, gap: 6, paddingTop: 24 },
  barWrapper: { flex: 1, alignItems: 'center', gap: 4 },
  value: { fontSize: 9, color: colors.textTertiary },
  barBg: { flex: 1, width: '100%', backgroundColor: colors.border, borderRadius: 4, justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 4 },
  label: { fontSize: 9, color: colors.textSecondary },
});

export function TrendsScreen() {
  const { trends } = useHealthData();
  const [selected, setSelected] = useState<Metric>('heartRate');
  const selectedMeta = METRICS.find((m) => m.key === selected)!;

  const latest = trends[trends.length - 1];
  const prev = trends[trends.length - 2];
  const delta = latest[selected] as number - (prev[selected] as number);
  const deltaStr = delta >= 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <SectionHeader title="Health Trends" subtitle="Last 7 days" />

        {/* Metric selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {METRICS.map((m) => (
            <TouchableOpacity
              key={m.key}
              style={[styles.tab, selected === m.key && { backgroundColor: m.color + '22', borderColor: m.color }]}
              onPress={() => setSelected(m.key)}
            >
              <Text style={[styles.tabText, selected === m.key && { color: m.color }]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Summary stat */}
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: selectedMeta.color }]}>
            {latest[selected]}{selectedMeta.unit}
          </Text>
          <Text style={styles.summaryLabel}>Today · {selectedMeta.label}</Text>
          <Text style={[styles.delta, { color: delta >= 0 ? colors.accentGreen : colors.accentRed }]}>
            {deltaStr}{selectedMeta.unit} vs yesterday
          </Text>
        </View>

        {/* Chart */}
        <View style={styles.chartCard}>
          <SimpleBarChart data={trends} metric={selected} color={selectedMeta.color} />
        </View>

        {/* Stats table */}
        <SectionHeader title="Weekly Summary" />
        <View style={styles.table}>
          {METRICS.map((m) => {
            const vals = trends.map((d) => d[m.key] as number);
            const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
            const hi = Math.max(...vals);
            const lo = Math.min(...vals);
            return (
              <View key={m.key} style={styles.tableRow}>
                <Text style={[styles.tableMetric, { color: m.color }]}>{m.label}</Text>
                <Text style={styles.tableVal}>avg {avg}{m.unit}</Text>
                <Text style={styles.tableVal}>↑{hi}{m.unit}</Text>
                <Text style={styles.tableVal}>↓{lo}{m.unit}</Text>
              </View>
            );
          })}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },

  tabScroll: { marginBottom: spacing.md },
  tab: {
    borderRadius: 20, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 14, paddingVertical: 7, marginRight: 8,
    backgroundColor: colors.surface,
  },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },

  summaryCard: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: 20, alignItems: 'center', marginBottom: 12,
  },
  summaryValue: { fontSize: 48, fontWeight: '800' },
  summaryLabel: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  delta: { fontSize: 13, fontWeight: '600', marginTop: 6 },

  chartCard: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 16, marginBottom: spacing.md },

  table: { backgroundColor: colors.surface, borderRadius: radius.md, overflow: 'hidden' },
  tableRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  tableMetric: { flex: 1.5, fontSize: 13, fontWeight: '600' },
  tableVal: { flex: 1, fontSize: 12, color: colors.textSecondary, textAlign: 'center' },
});
