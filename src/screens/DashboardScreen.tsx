import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MetricCard } from '../components/MetricCard';
import { SectionHeader } from '../components/SectionHeader';
import { colors, spacing, radius } from '../components/theme';
import { useHealthData } from '../hooks/useHealthData';
import { UserMode } from '../types';

interface Props {
  mode: UserMode;
  onToggleMode: () => void;
}

function sleepColor(quality: string) {
  if (quality === 'Excellent') return colors.accentGreen;
  if (quality === 'Good') return colors.accent;
  if (quality === 'Fair') return colors.accentOrange;
  return colors.accentRed;
}

export function DashboardScreen({ mode, onToggleMode }: Props) {
  const { metrics } = useHealthData();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>
          <View style={styles.modeToggle}>
            <Text style={styles.modeLabel}>{mode === 'general' ? 'General' : 'Athlete'}</Text>
            <Switch
              value={mode === 'athlete'}
              onValueChange={onToggleMode}
              trackColor={{ false: colors.border, true: colors.accentPurple }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Heart Rate & HRV */}
        <SectionHeader title="Heart" />
        <View style={styles.row}>
          <MetricCard label="Heart Rate" value={metrics.heartRate} unit="bpm" trend="down" accent={colors.accentRed} />
          <View style={styles.gap} />
          <MetricCard label="HRV" value={metrics.hrv} unit="ms" trend="up" accent={colors.accent} />
        </View>

        {/* Activity */}
        <SectionHeader title="Activity" />
        <View style={styles.row}>
          <MetricCard label="Steps" value={metrics.steps.toLocaleString()} trend="up" accent={colors.accentGreen} />
          <View style={styles.gap} />
          <MetricCard label="Calories" value={metrics.calories} unit="kcal" accent={colors.accentOrange} />
        </View>
        <View style={[styles.row, { marginTop: 10 }]}>
          <MetricCard label="Active Min" value={metrics.activeMinutes} unit="min" accent={colors.accentPurple} />
          <View style={styles.gap} />
          <MetricCard label="VO₂ Max" value={metrics.vo2Max} unit="ml/kg/min" accent={colors.accent} />
        </View>

        {/* Sleep */}
        <SectionHeader title="Sleep" />
        <View style={[styles.sleepCard]}>
          <View style={styles.sleepRow}>
            <View>
              <Text style={styles.sleepHours}>{metrics.sleepHours}h</Text>
              <Text style={styles.sleepSub}>last night</Text>
            </View>
            <View style={[styles.sleepBadge, { backgroundColor: sleepColor(metrics.sleepQuality) + '22' }]}>
              <Text style={[styles.sleepQuality, { color: sleepColor(metrics.sleepQuality) }]}>
                {metrics.sleepQuality}
              </Text>
            </View>
          </View>
          <View style={styles.sleepBar}>
            <View style={[styles.sleepFill, { width: `${(metrics.sleepHours / 9) * 100}%` as any }]} />
          </View>
          <Text style={styles.sleepTarget}>Goal: 8h</Text>
        </View>

        {/* Athlete readiness (athlete mode only) */}
        {mode === 'athlete' && (
          <>
            <SectionHeader title="Today's Readiness" subtitle="Based on HRV, sleep, and training load" />
            <View style={[styles.readinessCard]}>
              <Text style={styles.readinessScore}>82</Text>
              <Text style={styles.readinessLabel}>Ready to Train</Text>
              <Text style={styles.readinessSub}>HRV is elevated. Sleep was good. Load is moderate.</Text>
            </View>
          </>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  greeting: { fontSize: 22, fontWeight: '800', color: colors.text },
  date: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  modeToggle: { alignItems: 'center', gap: 4 },
  modeLabel: { fontSize: 11, color: colors.textSecondary },

  row: { flexDirection: 'row', marginBottom: 10 },
  gap: { width: 10 },

  sleepCard: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 16, marginBottom: spacing.md },
  sleepRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sleepHours: { fontSize: 32, fontWeight: '800', color: colors.text },
  sleepSub: { fontSize: 12, color: colors.textSecondary },
  sleepBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  sleepQuality: { fontSize: 13, fontWeight: '600' },
  sleepBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, marginBottom: 6 },
  sleepFill: { height: 6, backgroundColor: colors.accent, borderRadius: 3 },
  sleepTarget: { fontSize: 11, color: colors.textTertiary },

  readinessCard: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 20, alignItems: 'center', marginBottom: spacing.md },
  readinessScore: { fontSize: 56, fontWeight: '800', color: colors.accentGreen },
  readinessLabel: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 4 },
  readinessSub: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginTop: 6 },
});
