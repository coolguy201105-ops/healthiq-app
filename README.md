# HealthIQ – Health & Fitness Tracking App

A React Native (Expo) app for comprehensive health and fitness tracking with Apple Watch / HealthKit integration.

## Features

- **General Health Dashboard** — Heart rate, HRV, sleep, steps, calories, VO₂ Max
- **Health Trends** — 7-day interactive charts for all key metrics
- **Activity & Workouts** — Goal tracking, workout history, weekly summaries
- **Athlete Mode** — Readiness/recovery/fitness scores, training load (ACWR), wellness check-ins, injury tracking

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native + Expo (SDK 52) |
| Language | TypeScript |
| Navigation | React Navigation (Bottom Tabs) |
| Health Data | `react-native-health` (HealthKit / Apple Watch) |
| Charts | Custom bar charts via React Native SVG |
| Styling | StyleSheet (dark theme) |

## Getting Started

```bash
npm install
npm run ios       # requires macOS + Xcode
npm run android
npm run web
```

## HealthKit Setup (iOS)

Add to `app.json` under `expo.ios`:
```json
"infoPlist": {
  "NSHealthShareUsageDescription": "HealthIQ reads your health data to provide insights.",
  "NSHealthUpdateUsageDescription": "HealthIQ writes workout data."
}
```

Add `react-native-health` entitlements via EAS Build or bare workflow with `expo eject`.

## Project Structure

```
src/
  types/          — TypeScript interfaces
  data/           — Mock data (dev/simulator fallback)
  hooks/          — useHealthData (HealthKit + mock)
  components/     — MetricCard, ScoreRing, SectionHeader, theme
  screens/        — Dashboard, Trends, Activity, Athlete
  navigation/     — AppNavigator (bottom tabs)
```

## Build Phases

| Phase | Scope |
|---|---|
| 1 — Core | Dashboard, Trends, Activity, HealthKit integration |
| 2 — Athlete | Athlete Mode, injury tracking, wellness check-ins |
| 3 — Advanced | AI recommendations, long-term analytics, internship data |
