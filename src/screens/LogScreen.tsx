import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, TextInput, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getTodayLog, updateTodayLog, DayLog } from '../utils/storage';
import { getGoals, DEFAULT_GOALS } from '../screens/GoalsScreen';

export default function LogScreen() {
  const [log, setLog] = useState<DayLog>({ date: '', water: 0, sleep: 0, steps: 0 });
  const [sleepInput, setSleepInput] = useState('');
  const [stepsInput, setStepsInput] = useState('');
  const [goals, setGoals] = useState(DEFAULT_GOALS);

  useFocusEffect(
    useCallback(() => {
      getTodayLog().then(l => {
        setLog(l);
        setSleepInput(l.sleep > 0 ? String(l.sleep) : '');
        setStepsInput(l.steps > 0 ? String(l.steps) : '');
      });
      getGoals().then(setGoals);
    }, [])
  );

  async function addWater() {
    if (log.water >= goals.water) {
      Alert.alert('Goal reached!', 'You hit your water goal for today 💧');
      return;
    }
    const updated = { ...log, water: log.water + 1 };
    setLog(updated);
    await updateTodayLog({ water: updated.water });
  }

  async function saveSleep() {
    const val = parseFloat(sleepInput);
    if (isNaN(val) || val < 0 || val > 24) {
      Alert.alert('Invalid input', 'Enter a number between 0 and 24');
      return;
    }
    const updated = { ...log, sleep: val };
    setLog(updated);
    await updateTodayLog({ sleep: val });
    Alert.alert('Saved!', `Sleep logged: ${val} hrs`);
  }

  async function saveSteps() {
    const val = parseInt(stepsInput);
    if (isNaN(val) || val < 0) {
      Alert.alert('Invalid input', 'Enter a valid step count');
      return;
    }
    const updated = { ...log, steps: val };
    setLog(updated);
    await updateTodayLog({ steps: val });
    Alert.alert('Saved!', `Steps logged: ${val}`);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Log Today</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>💧 Water</Text>
          <Text style={styles.cardSub}>{log.water} / {goals.water} glasses</Text>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#2196F3' }]} onPress={addWater}>
            <Text style={styles.buttonText}>+ Add a Glass</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>😴 Sleep</Text>
          <Text style={styles.cardSub}>Goal: {goals.sleep} hrs</Text>
          <TextInput
            style={styles.input}
            placeholder="Hours slept (e.g. 7.5)"
            keyboardType="decimal-pad"
            value={sleepInput}
            onChangeText={setSleepInput}
          />
          <TouchableOpacity style={[styles.button, { backgroundColor: '#9C27B0' }]} onPress={saveSleep}>
            <Text style={styles.buttonText}>Save Sleep</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>👟 Steps</Text>
          <Text style={styles.cardSub}>Goal: {goals.steps.toLocaleString()} steps</Text>
          <TextInput
            style={styles.input}
            placeholder="Steps taken (e.g. 8000)"
            keyboardType="number-pad"
            value={stepsInput}
            onChangeText={setStepsInput}
          />
          <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50' }]} onPress={saveSteps}>
            <Text style={styles.buttonText}>Save Steps</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9f9f9' },
  container: { padding: 24 },
  heading: { fontSize: 32, fontWeight: 'bold', color: '#222', marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 4 },
  cardSub: { fontSize: 13, color: '#888', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, padding: 12, fontSize: 15, marginBottom: 12, backgroundColor: '#fafafa' },
  button: { borderRadius: 10, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});