import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ProgressRing from '../components/ProgressRing';
import { getTodayLog, DayLog } from '../utils/storage';
import { getGoals, DEFAULT_GOALS } from '../screens/GoalsScreen';

export default function HomeScreen() {
  const [log, setLog] = useState<DayLog>({ date: '', water: 0, sleep: 0, steps: 0 });
  const [goals, setGoals] = useState(DEFAULT_GOALS);

  useFocusEffect(
    useCallback(() => {
      getTodayLog().then(setLog);
      getGoals().then(setGoals);
    }, [])
  );

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Today</Text>
        <Text style={styles.date}>{today}</Text>

        <View style={styles.ringsRow}>
          <ProgressRing label="Water" value={log.water} goal={goals.water} unit="glasses" color="#2196F3" />
          <ProgressRing label="Sleep" value={log.sleep} goal={goals.sleep} unit="hrs" color="#9C27B0" />
          <ProgressRing label="Steps" value={log.steps} goal={goals.steps} unit="steps" color="#4CAF50" />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Daily Goals</Text>
          <SummaryRow label="💧 Water" value={log.water} goal={goals.water} unit="glasses" />
          <SummaryRow label="😴 Sleep" value={log.sleep} goal={goals.sleep} unit="hrs" />
          <SummaryRow label="👟 Steps" value={log.steps} goal={goals.steps} unit="steps" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value, goal, unit }: { label: string; value: number; goal: number; unit: string }) {
  const done = value >= goal;
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, { color: done ? '#4CAF50' : '#333' }]}>
        {value} / {goal} {unit} {done ? '✓' : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9f9f9' },
  container: { padding: 24 },
  heading: { fontSize: 32, fontWeight: 'bold', color: '#222' },
  date: { fontSize: 14, color: '#888', marginBottom: 24 },
  ringsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  summaryTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#222' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  summaryLabel: { fontSize: 14, color: '#444' },
  summaryValue: { fontSize: 14, fontWeight: '600' },
});