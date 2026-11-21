export type UserMode = 'general' | 'athlete';

export interface HealthMetrics {
  heartRate: number;
  hrv: number;
  steps: number;
  calories: number;
  sleepHours: number;
  sleepQuality: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  activeMinutes: number;
  vo2Max: number;
}

export interface WorkoutSession {
  id: string;
  date: string;
  type: string;
  durationMinutes: number;
  calories: number;
  avgHeartRate: number;
  distance?: number;
}

export interface HealthTrendPoint {
  date: string;
  heartRate: number;
  hrv: number;
  steps: number;
  sleepHours: number;
}

export interface InjuryRecord {
  id: string;
  date: string;
  bodyPart: string;
  type: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  status: 'Active' | 'Recovering' | 'Resolved';
  notes: string;
}

export interface WellnessAssessment {
  date: string;
  fatigue: number;       // 1–10
  soreness: number;      // 1–10
  stress: number;        // 1–10
  mood: number;          // 1–10
  sleepQuality: number;  // 1–10
  readiness: number;     // 1–10
}

export interface AthleteMetrics {
  trainingLoad: number;
  readinessScore: number;
  recoveryScore: number;
  fitnessScore: number;
  acuteLoad: number;
  chronicLoad: number;
}
