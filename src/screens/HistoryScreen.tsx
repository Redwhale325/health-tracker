import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getLogs, DayLog } from '../utils/storage';
import { getGoals, DEFAULT_GOALS } from '../screens/GoalsScreen';

export default function HistoryScreen() {
  const [logs, setLogs] = useState<DayLog[]>([]);
  const [goals, setGoals] = useState(DEFAULT_GOALS);

  useFocusEffect(
    useCallback(() => {
      getLogs().then(all => {
        const sorted = [...all].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);
        setLogs(sorted);
      });
      getGoals().then(setGoals);
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>History</Text>
        <Text style={styles.sub}>Last 7 days</Text>

        {logs.length === 0 && (
          <Text style={styles.empty}>No logs yet. Start tracking today!</Text>
        )}

        {logs.map(log => (
          <View key={log.date} style={styles.card}>
            <Text style={styles.date}>{formatDate(log.date)}</Text>
            <View style={styles.row}>
              <Stat label="💧 Water" value={log.water} goal={goals.water} unit="glasses" color="#2196F3" />
              <Stat label="😴 Sleep" value={log.sleep} goal={goals.sleep} unit="hrs" color="#9C27B0" />
              <Stat label="👟 Steps" value={log.steps} goal={goals.steps} unit="steps" color="#4CAF50" />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, goal, unit, color }: { label: string; value: number; goal: number; unit: string; color: string }) {
  const done = value >= goal;
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color: done ? color : '#333' }]}>
        {unit === 'steps' ? value.toLocaleString() : value}
      </Text>
      <Text style={styles.statUnit}>{unit} {done ? '✓' : ''}</Text>
    </View>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9f9f9' },
  container: { padding: 24 },
  heading: { fontSize: 32, fontWeight: 'bold', color: '#222' },
  sub: { fontSize: 14, color: '#888', marginBottom: 20 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 60, fontSize: 15 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  date: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { alignItems: 'center', flex: 1 },
  statLabel: { fontSize: 11, color: '#888', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  statUnit: { fontSize: 10, color: '#aaa' },
});