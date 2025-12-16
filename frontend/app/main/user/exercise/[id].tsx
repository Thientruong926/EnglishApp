// app/main/exercise/[id].tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useExercise } from '../../../../src/context/ExcerciseContext';
import { Exercise } from '../../../../src/types';

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessonId = id;

  const { exercises, fetchExercisesByLesson, isLoading } = useExercise();

  /* =========================
     STATE
  ========================= */
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  /* =========================
     FETCH EXERCISES
  ========================= */
  useEffect(() => {
    if (lessonId) {
      fetchExercisesByLesson(lessonId);
    }
  }, [lessonId]);

  /* =========================
     CHOOSE ANSWER
  ========================= */
  const handleChoose = (exerciseId: string, answer: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [exerciseId]: answer }));
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = () => {
    setSubmitted(true);
  };

  /* =========================
     SCORE
  ========================= */
  const score = useMemo(() => {
    if (!submitted) return null;

    let correct = 0;
    exercises.forEach(ex => {
      if (answers[ex._id] === ex.correct_answer) {
        correct++;
      }
    });

    return { correct, total: exercises.length };
  }, [submitted, exercises, answers]);

  /* =========================
     GUARDS
  ========================= */
  if (!lessonId) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Thiếu ID bài học</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Đang tải bài tập...</Text>
      </View>
    );
  }

  if (!exercises.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          Chưa có bài tập cho bài học này
        </Text>
      </View>
    );
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Bài tập</Text>
        <Text style={styles.sub}>
          {exercises.length} câu hỏi
        </Text>
      </View>

      {exercises.map((ex, idx) => (
        <View key={ex._id} style={styles.card}>
          <Text style={styles.qIndex}>Câu {idx + 1}</Text>
          <Text style={styles.question}>{ex.question}</Text>

          <View style={{ marginTop: 10 }}>
            {ex.options?.map(opt => {
              const chosen = answers[ex._id] === opt;
              const isCorrect = submitted && opt === ex.correct_answer;
              const isWrong =
                submitted && chosen && !isCorrect;

              return (
                <TouchableOpacity
                  key={opt}
                  activeOpacity={0.8}
                  style={[
                    styles.option,
                    chosen && styles.optionChosen,
                    isCorrect && styles.optionCorrect,
                    isWrong && styles.optionWrong,
                  ]}
                  onPress={() => handleChoose(ex._id, opt)}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        {!submitted ? (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.submitBtn}
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>Nộp bài</Text>
          </TouchableOpacity>
        ) : (
          score && (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>
                Kết quả: {score.correct}/{score.total} câu đúng
              </Text>
            </View>
          )
        )}
      </View>
    </ScrollView>
  );
}

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#e74c3c', fontSize: 16 },

  header: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },
  sub: { color: '#7f8c8d', marginTop: 6 },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    padding: 14,
    elevation: 2,
  },
  qIndex: {
    color: '#2196f3',
    fontWeight: '700',
    marginBottom: 8,
  },
  question: { fontSize: 16, color: '#2c3e50' },

  option: {
    backgroundColor: '#f0f2f5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  optionChosen: { backgroundColor: '#bbdefb' },
  optionCorrect: { backgroundColor: '#c8e6c9' },
  optionWrong: { backgroundColor: '#ffcdd2' },

  optionText: { color: '#34495e' },

  footer: { paddingHorizontal: 16, paddingVertical: 16 },
  submitBtn: {
    backgroundColor: '#27ae60',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
  },
  submitText: { color: '#fff', fontWeight: '700' },

  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  resultText: { color: '#2c3e50', fontWeight: '700' },
});
