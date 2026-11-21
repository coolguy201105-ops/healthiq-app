import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionHeader } from '../components/SectionHeader';
import { colors, spacing, radius } from '../components/theme';
import { useHealthData } from '../hooks/useHealthData';
import { WorkoutSession } from '../types';

const ICONS: Record<string, string> = {
  Running: '🏃',
  Cycling: '🚴',
  Swimming: '🏊',
  Strength: '🏋️',
  Yoga: '🧘',
  Other: '⚡',
};

function WorkoutCard({ w }: { w: WorkoutSession }) {
  return (
    <View style={styles.workoutCard}>
      <View style={styles.workoutIcon}>
        <Text style={styles.workoutEmoji}>{ICONS[w.type] ?? ICONS.Other}</Text>
      </View>
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutType}>{w.type}</Text>
        <Text style={styles.workoutDate}>{w.date}</Text>
      </View>
      <View style={styles.workoutStats}>
        <Text style={styles.workoutStatVal}>{w.durationMinutes}m</Text>
        <Text style={styles.workoutStatLabel}>duration</Text>
      </View>
      <View style={styles.workoutStats}>
        <Text style={styles.workoutStatVal}>{w.calories}</Text>
        <Text style={styles.workoutStatLabel}>kcal</Text>
      </View>
      <View style={styles.workoutStats}>
        <Text style={styles.workoutStatVal}>{w.avgHeartRate}</Text>
        <Text style={styles.workoutStatLabel}>avg bpm</Text>
      </View>
    </View>
  );
}

function GoalBar({ label, current, goal, color, unit }: { label: string; current: number; goal: number; color: string; unit: string }) {
  const pct = Math.min((current / goal) * 100, 100);
  return (
    <View style={styles.goalRow}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalLabel}>{label}</Text>
        <Text style={[styles.goalValue, { color }]}>{current.toLocaleString()}<Text style={styles.goalTarget}> / {goal.toLocaleString()} {unit}</Text></Text>
      </View>
      <View style={styles.goalBarBg}>
        <View style={[styles.goalBarFill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export function ActivityScreen() {
  const { workouts, metrics } = useHealthData();

  const totalWeeklyCalories = workouts.slice(0, 4).reduce((s, w) => s + w.calories, 0);
  const totalWeeklyMinutes = workouts.slice(0, 4).reduce((s, w) => s + w.durationMinutes, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <SectionHeader title="Activity" subtitle="Movement & workouts" />

        {/* Daily goals */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Goals</Text>
          <GoalBar label="Steps" current={metrics.steps} goal={10000} color={colors.accentGreen} unit="steps" />
          <GoalBar label="Active Minutes" current={metrics.activeMinutes} goal={60} color={colors.accent} unit="min" />
          <GoalBar label="Calories" current={metrics.calories} goal={2500} color={colors.accentOrange} unit="kcal" />
        </View>

        {/* Weekly summary */}
        <View style={[styles.card, { marginTop: 12 }]}>
          <Text style={styles.cardTitle}>This Week</Text>
          <View style={styles.weekRow}>
            <View style={styles.weekStat}>
              <Text style={styles.weekVal}>{workouts.slice(0, 4).length}</Text>
              <Text style={styles.weekLabel}>Workouts</Text>
            </View>
            <View style={styles.weekDivider} />
            <View style={styles.weekStat}>
              <Text style={styles.weekVal}>{totalWeeklyMinutes}m</Text>
              <Text style={styles.weekLabel}>Active Time</Text>
            </View>
            <View style={styles.weekDivider} />
            <View style={styles.weekStat}>
              <Text style={styles.weekVal}>{totalWeeklyCalories}</Text>
              <Text style={styles.weekLabel}>kcal burned</Text>
            </View>
          </View>
        </View>

        {/* Workout history */}
        <SectionHeader title="Recent Workouts" />
        {workouts.map((w) => <WorkoutCard key={w.id} w={w} />)}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },

  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 16 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 14 },

  goalRow: { marginBottom: 12 },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  goalLabel: { fontSize: 13, color: colors.textSecondary },
  goalValue: { fontSize: 13, fontWeight: '600' },
  goalTarget: { color: colors.textTertiary, fontWeight: '400' },
  goalBarBg: { height: 6, backgroundColor: colors.border, borderRadius: 3 },
  goalBarFill: { height: 6, borderRadius: 3 },

  weekRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8 },
  weekStat: { alignItems: 'center' },
  weekVal: { fontSize: 22, fontWeight: '800', color: colors.text },
  weekLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  weekDivider: { width: 1, backgroundColor: colors.border },

  workoutCard: {
    backgroundColor: colors.surface, borderRadius: radius.md, padding: 14,
    flexDirection: 'row', alignItems: 'center', marginBottom: 8,
  },
  workoutIcon: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surfaceHigh,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  workoutEmoji: { fontSize: 20 },
  workoutInfo: { flex: 1 },
  workoutType: { fontSize: 14, fontWeight: '700', color: colors.text },
  workoutDate: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  workoutStats: { alignItems: 'center', marginLeft: 10 },
  workoutStatVal: { fontSize: 14, fontWeight: '700', color: colors.text },
  workoutStatLabel: { fontSize: 10, color: colors.textTertiary },
});
