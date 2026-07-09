import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, TextInput, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GOALS_KEY = 'user_goals';

export const DEFAULT_GOALS = { water: 8, sleep: 8, steps: 10000 };

export async function getGoals() {
  const raw = await AsyncStorage.getItem(GOALS_KEY);
  return raw ? JSON.parse(raw) : DEFAULT_GOALS;
}

export async function saveGoals(goals: typeof DEFAULT_GOALS) {
  await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export default function GoalsScreen() {
  const [water, setWater] = useState('');
  const [sleep, setSleep] = useState('');
  const [steps, setSteps] = useState('');

  useFocusEffect(
    useCallback(() => {
      getGoals().then(g => {
        setWater(String(g.water));
        setSleep(String(g.sleep));
        setSteps(String(g.steps));
      });
    }, [])
  );

  async function handleSave() {
    const w = parseInt(water);
    const sl = parseFloat(sleep);
    const st = parseInt(steps);

    if (isNaN(w) || w <= 0) { Alert.alert('Invalid', 'Enter a valid water goal'); return; }
    if (isNaN(sl) || sl <= 0 || sl > 24) { Alert.alert('Invalid', 'Enter a valid sleep goal (1–24)'); return; }
    if (isNaN(st) || st <= 0) { Alert.alert('Invalid', 'Enter a valid steps goal'); return; }

    await saveGoals({ water: w, sleep: sl, steps: st });
    Alert.alert('Saved!', 'Your goals have been updated.');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Edit Goals</Text>
        <Text style={styles.sub}>Set your daily targets</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>💧 Water Goal</Text>
          <Text style={styles.cardSub}>How many glasses per day?</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={water}
            onChangeText={setWater}
            placeholder="e.g. 8"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>😴 Sleep Goal</Text>
          <Text style={styles.cardSub}>How many hours per night?</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={sleep}
            onChangeText={setSleep}
            placeholder="e.g. 8"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>👟 Steps Goal</Text>
          <Text style={styles.cardSub}>How many steps per day?</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={steps}
            onChangeText={setSteps}
            placeholder="e.g. 10000"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Goals</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9f9f9' },
  container: { padding: 24 },
  heading: { fontSize: 32, fontWeight: 'bold', color: '#222' },
  sub: { fontSize: 14, color: '#888', marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 4 },
  cardSub: { fontSize: 13, color: '#888', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: '#fafafa' },
  saveButton: { backgroundColor: '#2196F3', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8 },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});