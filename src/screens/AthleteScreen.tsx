import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionHeader } from '../components/SectionHeader';
import { ScoreRing } from '../components/ScoreRing';
import { colors, spacing, radius } from '../components/theme';
import { useHealthData } from '../hooks/useHealthData';
import { InjuryRecord, WellnessAssessment } from '../types';

type Tab = 'overview' | 'wellness' | 'injuries';

function StatusBadge({ status }: { status: InjuryRecord['status'] }) {
  const c = status === 'Active' ? colors.accentRed : status === 'Recovering' ? colors.accentOrange : colors.accentGreen;
  return (
    <View style={[injuryStyles.badge, { backgroundColor: c + '22' }]}>
      <Text style={[injuryStyles.badgeText, { color: c }]}>{status}</Text>
    </View>
  );
}

function SeverityDot({ severity }: { severity: InjuryRecord['severity'] }) {
  const c = severity === 'Severe' ? colors.accentRed : severity === 'Moderate' ? colors.accentOrange : colors.accentGreen;
  return <View style={[injuryStyles.dot, { backgroundColor: c }]} />;
}

function SliderRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <View style={wellness.sliderRow}>
      <Text style={wellness.sliderLabel}>{label}</Text>
      <View style={wellness.dots}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <TouchableOpacity key={n} onPress={() => onChange(n)} style={[wellness.dot, value >= n && { backgroundColor: colors.accent }]} />
        ))}
      </View>
      <Text style={wellness.sliderVal}>{value}/10</Text>
    </View>
  );
}

export function AthleteScreen() {
  const { athleteMetrics, injuries, wellness, addInjury, updateInjury, submitWellness } = useHealthData();
  const [tab, setTab] = useState<Tab>('overview');
  const [showAddInjury, setShowAddInjury] = useState(false);
  const [newInjury, setNewInjury] = useState({ bodyPart: '', type: '', notes: '' });

  const today = wellness[wellness.length - 1];
  const [draft, setDraft] = useState<WellnessAssessment>({
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fatigue: 5, soreness: 5, stress: 5, mood: 5, sleepQuality: 5, readiness: 5,
  });
  const [submitted, setSubmitted] = useState(false);

  const TABS: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'wellness', label: 'Wellness' },
    { key: 'injuries', label: 'Injuries' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Tab bar */}
      <View style={styles.tabBar}>
        {TABS.map((t) => (
          <TouchableOpacity key={t.key} style={[styles.tabBtn, tab === t.key && styles.tabActive]} onPress={() => setTab(t.key)}>
            <Text style={[styles.tabText, tab === t.key && { color: colors.accent }]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <>
            <SectionHeader title="Athlete Overview" subtitle="Performance & recovery scores" />
            <View style={styles.ringsRow}>
              <ScoreRing score={athleteMetrics.readinessScore} label="Readiness" color={colors.accentGreen} />
              <ScoreRing score={athleteMetrics.recoveryScore} label="Recovery" color={colors.accent} />
              <ScoreRing score={athleteMetrics.fitnessScore} label="Fitness" color={colors.accentPurple} />
            </View>

            <View style={[styles.card, { marginTop: 16 }]}>
              <Text style={styles.cardTitle}>Training Load</Text>
              <View style={styles.loadRow}>
                <View style={styles.loadStat}>
                  <Text style={styles.loadVal}>{athleteMetrics.acuteLoad}</Text>
                  <Text style={styles.loadLabel}>Acute (7d)</Text>
                </View>
                <View style={styles.loadDivider} />
                <View style={styles.loadStat}>
                  <Text style={styles.loadVal}>{athleteMetrics.chronicLoad}</Text>
                  <Text style={styles.loadLabel}>Chronic (28d)</Text>
                </View>
                <View style={styles.loadDivider} />
                <View style={styles.loadStat}>
                  <Text style={[styles.loadVal, { color: colors.accentOrange }]}>
                    {(athleteMetrics.acuteLoad / athleteMetrics.chronicLoad).toFixed(2)}
                  </Text>
                  <Text style={styles.loadLabel}>ACWR</Text>
                </View>
              </View>
              <Text style={styles.acwrNote}>ACWR in optimal zone (0.8–1.3)</Text>
            </View>

            <SectionHeader title="Today's Wellness" subtitle={today.date} />
            <View style={styles.wellnessGrid}>
              {[
                { label: 'Fatigue', val: today.fatigue },
                { label: 'Soreness', val: today.soreness },
                { label: 'Stress', val: today.stress },
                { label: 'Mood', val: today.mood },
                { label: 'Sleep', val: today.sleepQuality },
                { label: 'Readiness', val: today.readiness },
              ].map((item) => (
                <View key={item.label} style={styles.wellnessTile}>
                  <Text style={[styles.wellnessVal, { color: item.val >= 7 ? colors.accentGreen : item.val >= 5 ? colors.accentOrange : colors.accentRed }]}>
                    {item.val}
                  </Text>
                  <Text style={styles.wellnessLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* WELLNESS TAB */}
        {tab === 'wellness' && (
          <>
            <SectionHeader title="Daily Wellness Check-In" subtitle="Rate how you feel today (1 = worst, 10 = best)" />
            {submitted ? (
              <View style={styles.card}>
                <Text style={[styles.cardTitle, { color: colors.accentGreen, textAlign: 'center' }]}>Check-in submitted!</Text>
                <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 4 }}>See your scores in Overview.</Text>
              </View>
            ) : (
              <View style={styles.card}>
                <SliderRow label="Fatigue" value={draft.fatigue} onChange={(v) => setDraft((d) => ({ ...d, fatigue: v }))} />
                <SliderRow label="Soreness" value={draft.soreness} onChange={(v) => setDraft((d) => ({ ...d, soreness: v }))} />
                <SliderRow label="Stress" value={draft.stress} onChange={(v) => setDraft((d) => ({ ...d, stress: v }))} />
                <SliderRow label="Mood" value={draft.mood} onChange={(v) => setDraft((d) => ({ ...d, mood: v }))} />
                <SliderRow label="Sleep Quality" value={draft.sleepQuality} onChange={(v) => setDraft((d) => ({ ...d, sleepQuality: v }))} />
                <SliderRow label="Readiness" value={draft.readiness} onChange={(v) => setDraft((d) => ({ ...d, readiness: v }))} />
                <TouchableOpacity style={styles.submitBtn} onPress={() => { submitWellness(draft); setSubmitted(true); }}>
                  <Text style={styles.submitBtnText}>Submit Check-In</Text>
                </TouchableOpacity>
              </View>
            )}

            <SectionHeader title="Wellness History" />
            <View style={styles.card}>
              {wellness.slice().reverse().map((w) => (
                <View key={w.date} style={styles.historyRow}>
                  <Text style={styles.historyDate}>{w.date}</Text>
                  <Text style={[styles.historyScore, { color: colors.accentGreen }]}>↑{w.readiness}</Text>
                  <Text style={[styles.historyScore, { color: colors.accent }]}>💤{w.sleepQuality}</Text>
                  <Text style={[styles.historyScore, { color: colors.accentOrange }]}>😓{w.fatigue}</Text>
                  <Text style={[styles.historyScore, { color: colors.accentRed }]}>⚡{w.soreness}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* INJURIES TAB */}
        {tab === 'injuries' && (
          <>
            <View style={styles.injuriesHeader}>
              <SectionHeader title="Injury & Recovery" />
              <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddInjury(true)}>
                <Text style={styles.addBtnText}>+ Log Injury</Text>
              </TouchableOpacity>
            </View>

            {injuries.map((injury) => (
              <View key={injury.id} style={styles.injuryCard}>
                <View style={styles.injuryTop}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <SeverityDot severity={injury.severity} />
                    <Text style={styles.injuryPart}>{injury.bodyPart}</Text>
                  </View>
                  <StatusBadge status={injury.status} />
                </View>
                <Text style={styles.injuryType}>{injury.type}</Text>
                <Text style={styles.injuryNotes}>{injury.notes}</Text>
                <Text style={styles.injuryDate}>{injury.date}</Text>
                {injury.status !== 'Resolved' && (
                  <View style={styles.injuryActions}>
                    <TouchableOpacity onPress={() => updateInjury(injury.id, { status: 'Recovering' })} style={styles.injuryActionBtn}>
                      <Text style={styles.injuryActionText}>Mark Recovering</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => updateInjury(injury.id, { status: 'Resolved' })} style={[styles.injuryActionBtn, { borderColor: colors.accentGreen }]}>
                      <Text style={[styles.injuryActionText, { color: colors.accentGreen }]}>Mark Resolved</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Add Injury Modal */}
      <Modal visible={showAddInjury} transparent animationType="slide">
        <View style={modal.overlay}>
          <View style={modal.sheet}>
            <Text style={modal.title}>Log Injury</Text>
            <TextInput style={modal.input} placeholder="Body part (e.g. Left Knee)" placeholderTextColor={colors.textTertiary}
              value={newInjury.bodyPart} onChangeText={(t) => setNewInjury((p) => ({ ...p, bodyPart: t }))} />
            <TextInput style={modal.input} placeholder="Injury type (e.g. Strain, Tendinitis)" placeholderTextColor={colors.textTertiary}
              value={newInjury.type} onChangeText={(t) => setNewInjury((p) => ({ ...p, type: t }))} />
            <TextInput style={[modal.input, { height: 80 }]} placeholder="Notes..." placeholderTextColor={colors.textTertiary}
              multiline value={newInjury.notes} onChangeText={(t) => setNewInjury((p) => ({ ...p, notes: t }))} />
            <View style={modal.row}>
              <TouchableOpacity style={modal.cancel} onPress={() => setShowAddInjury(false)}>
                <Text style={modal.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={modal.confirm} onPress={() => {
                if (newInjury.bodyPart && newInjury.type) {
                  addInjury({
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    bodyPart: newInjury.bodyPart, type: newInjury.type,
                    severity: 'Mild', status: 'Active', notes: newInjury.notes,
                  });
                  setNewInjury({ bodyPart: '', type: '', notes: '' });
                  setShowAddInjury(false);
                }
              }}>
                <Text style={modal.confirmText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },

  tabBar: { flexDirection: 'row', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.accent },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },

  ringsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16 },

  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 16 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 14 },

  loadRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  loadStat: { alignItems: 'center' },
  loadVal: { fontSize: 22, fontWeight: '800', color: colors.text },
  loadLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  loadDivider: { width: 1, backgroundColor: colors.border },
  acwrNote: { fontSize: 11, color: colors.accentGreen, textAlign: 'center' },

  wellnessGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  wellnessTile: {
    backgroundColor: colors.surface, borderRadius: radius.sm, padding: 12,
    alignItems: 'center', width: '30%',
  },
  wellnessVal: { fontSize: 24, fontWeight: '800' },
  wellnessLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },

  submitBtn: { backgroundColor: colors.accent, borderRadius: radius.sm, padding: 14, alignItems: 'center', marginTop: 12 },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: colors.white },

  historyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  historyDate: { flex: 1.5, fontSize: 13, color: colors.textSecondary },
  historyScore: { flex: 1, fontSize: 13, fontWeight: '600', textAlign: 'center' },

  injuriesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addBtn: { backgroundColor: colors.accentRed + '22', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  addBtnText: { fontSize: 13, color: colors.accentRed, fontWeight: '600' },

  injuryCard: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, marginBottom: 10 },
  injuryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  injuryPart: { fontSize: 15, fontWeight: '700', color: colors.text },
  injuryType: { fontSize: 13, color: colors.textSecondary, marginBottom: 4 },
  injuryNotes: { fontSize: 12, color: colors.textTertiary, marginBottom: 6 },
  injuryDate: { fontSize: 11, color: colors.textTertiary },
  injuryActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  injuryActionBtn: { flex: 1, borderWidth: 1, borderColor: colors.accentOrange, borderRadius: 8, padding: 8, alignItems: 'center' },
  injuryActionText: { fontSize: 12, color: colors.accentOrange, fontWeight: '600' },
});

const injuryStyles = StyleSheet.create({
  badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  dot: { width: 8, height: 8, borderRadius: 4 },
});

const wellness = StyleSheet.create({
  sliderRow: { marginBottom: 14 },
  sliderLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.border },
  sliderVal: { fontSize: 11, color: colors.textTertiary, marginTop: 4, textAlign: 'right' },
});

const modal = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  title: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 16 },
  input: {
    backgroundColor: colors.surfaceHigh, borderRadius: 10, padding: 12,
    fontSize: 14, color: colors.text, marginBottom: 10,
  },
  row: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancel: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  cancelText: { color: colors.textSecondary, fontWeight: '600' },
  confirm: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: colors.accent, alignItems: 'center' },
  confirmText: { color: colors.white, fontWeight: '700' },
});
