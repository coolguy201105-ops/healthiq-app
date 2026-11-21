import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import {
  HealthMetrics,
  WorkoutSession,
  HealthTrendPoint,
  InjuryRecord,
  WellnessAssessment,
  AthleteMetrics,
} from '../types';
import {
  mockHealthMetrics,
  mockWorkouts,
  mockTrends,
  mockInjuries,
  mockWellness,
  mockAthleteMetrics,
} from '../data/mockData';

// On a real device this hook would call AppleHealthKit.initHealthKit()
// and query live data. On simulators / Android it falls back to mock data.
// See: https://github.com/agencyenterprise/react-native-health

export function useHealthData() {
  const [metrics, setMetrics] = useState<HealthMetrics>(mockHealthMetrics);
  const [workouts, setWorkouts] = useState<WorkoutSession[]>(mockWorkouts);
  const [trends, setTrends] = useState<HealthTrendPoint[]>(mockTrends);
  const [injuries, setInjuries] = useState<InjuryRecord[]>(mockInjuries);
  const [wellness, setWellness] = useState<WellnessAssessment[]>(mockWellness);
  const [athleteMetrics, setAthleteMetrics] = useState<AthleteMetrics>(mockAthleteMetrics);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      setLoading(false);
      return;
    }

    const initHealthKit = async () => {
      try {
        const AppleHealthKit = require('react-native-health').default;
        const permissions = {
          permissions: {
            read: [
              AppleHealthKit.Constants.Permissions.HeartRate,
              AppleHealthKit.Constants.Permissions.HeartRateVariability,
              AppleHealthKit.Constants.Permissions.Steps,
              AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
              AppleHealthKit.Constants.Permissions.SleepAnalysis,
              AppleHealthKit.Constants.Permissions.Workout,
              AppleHealthKit.Constants.Permissions.VO2Max,
            ],
            write: [],
          },
        };

        AppleHealthKit.initHealthKit(permissions, (err: Error) => {
          if (err) {
            console.warn('HealthKit init failed, using mock data:', err.message);
            setLoading(false);
            return;
          }
          setAuthorized(true);
          // In a full implementation, fetch live data here and call setters
          setLoading(false);
        });
      } catch {
        // react-native-health not linked (Expo Go / simulator) — use mock data
        setLoading(false);
      }
    };

    initHealthKit();
  }, []);

  const addInjury = (injury: Omit<InjuryRecord, 'id'>) => {
    const next: InjuryRecord = { ...injury, id: String(Date.now()) };
    setInjuries((prev) => [next, ...prev]);
  };

  const updateInjury = (id: string, patch: Partial<InjuryRecord>) => {
    setInjuries((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const submitWellness = (assessment: WellnessAssessment) => {
    setWellness((prev) => [...prev, assessment]);
  };

  return {
    metrics,
    workouts,
    trends,
    injuries,
    wellness,
    athleteMetrics,
    authorized,
    loading,
    addInjury,
    updateInjury,
    submitWellness,
  };
}
