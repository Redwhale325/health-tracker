import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DayLog {
  date: string;
  water: number;
  sleep: number;
  steps: number;
}

import { getGoals } from '../screens/GoalsScreen';
export async function getActiveGoals() {
  return getGoals();
}

const STORAGE_KEY = 'health_logs';

export async function getLogs(): Promise<DayLog[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveLogs(logs: DayLog[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export async function getTodayLog(): Promise<DayLog> {
  const today = new Date().toISOString().split('T')[0];
  const logs = await getLogs();
  return logs.find(l => l.date === today) || { date: today, water: 0, sleep: 0, steps: 0 };
}

export async function updateTodayLog(updates: Partial<DayLog>): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const logs = await getLogs();
  const idx = logs.findIndex(l => l.date === today);
  if (idx >= 0) {
    logs[idx] = { ...logs[idx], ...updates };
  } else {
    logs.push({ date: today, water: 0, sleep: 0, steps: 0, ...updates });
  }
  await saveLogs(logs);
}