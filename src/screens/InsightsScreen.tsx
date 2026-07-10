import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getLogs, DayLog } from '../utils/storage';
import { getGoals, DEFAULT_GOALS } from '../screens/GoalsScreen';

const GEMINI_API_KEY = 'AIzaSyAb8RN6lig0quIFTo4TwCB64VpgfIqsXq9LWzXhojiLy7iqUVcg';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

interface Message {
  role: 'user' | 'ai';
  text: string;
}

function buildSystemContext(logs: DayLog[], goals: typeof DEFAULT_GOALS): string {
  const recent = [...logs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);
  const logSummary = recent.map(l =>
    `${l.date}: water=${l.water}/${goals.water} glasses, sleep=${l.sleep}/${goals.sleep}hrs, steps=${l.steps}/${goals.steps}`
  ).join('\n');

  return `You are a friendly health coach inside a mobile health tracking app called HealthTracker. 
The user tracks daily water intake, sleep, and steps. Here is their recent data:

${logSummary || 'No data logged yet.'}

Answer questions about their health data, give encouragement, and provide actionable tips. Keep responses concise and friendly. If they haven't logged data, encourage them to start.`;
}

export default function InsightsScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hi! I'm your health coach 👋 Ask me anything about your progress, or say \"How did I do this week?\"" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<DayLog[]>([]);
  const [goals, setGoals] = useState(DEFAULT_GOALS);
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      getLogs().then(setLogs);
      getGoals().then(setGoals);
    }, [])
  );

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const systemContext = buildSystemContext(logs, goals);
      console.log('API KEY:', GEMINI_API_KEY);
      console.log('URL:', GEMINI_URL);

      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemContext + '\n\nUser: ' + text }] }
          ]
        })
      });

      const data = await response.json();
      console.log('Gemini response:', JSON.stringify(data));

      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
        (data?.error?.message ? `API Error: ${data.error.message}` : 'Sorry, I could not get a response.');
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (e) {
      console.log('Fetch error:', e);
      setMessages(prev => [...prev, { role: 'ai', text: `Error: ${String(e)}` }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={styles.heading}>AI Health Coach</Text>
        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, i) => (
            <View key={i} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
              <Text style={[styles.bubbleText, msg.role === 'user' ? styles.userText : styles.aiText]}>
                {msg.text}
              </Text>
            </View>
          ))}
          {loading && (
            <View style={styles.aiBubble}>
              <ActivityIndicator size="small" color="#2196F3" />
            </View>
          )}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask your health coach..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={loading}>
            <Text style={styles.sendText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9f9f9' },
  flex: { flex: 1 },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#222', padding: 20, paddingBottom: 8 },
  messages: { flex: 1, paddingHorizontal: 16 },
  messagesContent: { paddingVertical: 8, gap: 10 },
  bubble: { maxWidth: '80%', borderRadius: 16, padding: 12, marginVertical: 4 },
  aiBubble: { backgroundColor: '#fff', alignSelf: 'flex-start', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  userBubble: { backgroundColor: '#2196F3', alignSelf: 'flex-end' },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  aiText: { color: '#222' },
  userText: { color: '#fff' },
  inputRow: { flexDirection: 'row', padding: 12, gap: 8, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff' },
  input: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, maxHeight: 100 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#2196F3', alignItems: 'center', justifyContent: 'center' },
  sendText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});