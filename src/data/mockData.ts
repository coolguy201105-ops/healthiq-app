import {
  HealthMetrics,
  WorkoutSession,
  HealthTrendPoint,
  InjuryRecord,
  WellnessAssessment,
  AthleteMetrics,
} from '../types';

export const mockHealthMetrics: HealthMetrics = {
  heartRate: 68,
  hrv: 52,
  steps: 8432,
  calories: 2140,
  sleepHours: 7.3,
  sleepQuality: 'Good',
  activeMinutes: 47,
  vo2Max: 42.5,
};

export const mockWorkouts: WorkoutSession[] = [
  { id: '1', date: 'Nov 21', type: 'Running', durationMinutes: 42, calories: 410, avgHeartRate: 158, distance: 5.2 },
  { id: '2', date: 'Nov 19', type: 'Strength', durationMinutes: 55, calories: 320, avgHeartRate: 134 },
  { id: '3', date: 'Nov 17', type: 'Cycling', durationMinutes: 60, calories: 480, avgHeartRate: 145, distance: 18.4 },
  { id: '4', date: 'Nov 15', type: 'Swimming', durationMinutes: 35, calories: 290, avgHeartRate: 140, distance: 1.2 },
  { id: '5', date: 'Nov 13', type: 'Running', durationMinutes: 50, calories: 490, avgHeartRate: 162, distance: 6.1 },
];

export const mockTrends: HealthTrendPoint[] = [
  { date: 'Nov 15', heartRate: 71, hrv: 48, steps: 7200, sleepHours: 6.8 },
  { date: 'Nov 16', heartRate: 69, hrv: 50, steps: 9100, sleepHours: 7.5 },
  { date: 'Nov 17', heartRate: 72, hrv: 46, steps: 6800, sleepHours: 7.0 },
  { date: 'Nov 18', heartRate: 67, hrv: 54, steps: 10200, sleepHours: 8.1 },
  { date: 'Nov 19', heartRate: 70, hrv: 51, steps: 8900, sleepHours: 7.2 },
  { date: 'Nov 20', heartRate: 66, hrv: 55, steps: 11000, sleepHours: 7.8 },
  { date: 'Nov 21', heartRate: 68, hrv: 52, steps: 8432, sleepHours: 7.3 },
];

export const mockInjuries: InjuryRecord[] = [
  {
    id: '1',
    date: 'Nov 10',
    bodyPart: 'Left Knee',
    type: 'Patellar Tendinitis',
    severity: 'Moderate',
    status: 'Recovering',
    notes: 'Ice + rest after sessions. Avoid deep squats.',
  },
  {
    id: '2',
    date: 'Oct 28',
    bodyPart: 'Right Shoulder',
    type: 'Muscle Strain',
    severity: 'Mild',
    status: 'Resolved',
    notes: 'Full ROM restored. Resume normal training.',
  },
];

export const mockWellness: WellnessAssessment[] = [
  { date: 'Nov 17', fatigue: 6, soreness: 7, stress: 5, mood: 7, sleepQuality: 6, readiness: 6 },
  { date: 'Nov 18', fatigue: 4, soreness: 5, stress: 4, mood: 8, sleepQuality: 8, readiness: 8 },
  { date: 'Nov 19', fatigue: 5, soreness: 6, stress: 6, mood: 7, sleepQuality: 7, readiness: 7 },
  { date: 'Nov 20', fatigue: 3, soreness: 4, stress: 3, mood: 9, sleepQuality: 8, readiness: 9 },
  { date: 'Nov 21', fatigue: 4, soreness: 5, stress: 4, mood: 8, sleepQuality: 7, readiness: 8 },
];

export const todayWellness: WellnessAssessment = mockWellness[mockWellness.length - 1];

export const mockAthleteMetrics: AthleteMetrics = {
  trainingLoad: 68,
  readinessScore: 82,
  recoveryScore: 76,
  fitnessScore: 71,
  acuteLoad: 420,
  chronicLoad: 380,
};
