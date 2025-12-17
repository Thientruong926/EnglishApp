// app/main/exercise/[id].tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useExercise } from '../../../../src/context/ExcerciseContext';

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessonId = id;

  const { exercises, fetchExercisesByLesson, isLoading } = useExercise();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);
  const [history, setHistory] = useState<{ score: number; date: string }[]>([]);

  /* =========================
     FETCH EXERCISES
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      if (!lessonId) return;
      await fetchExercisesByLesson(lessonId);
    };
    fetchData();
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
    if (!exercises.length) return;

    let correct = 0;
    exercises.forEach(ex => {
      if (answers[ex._id] === ex.correct_answer) correct++;
    });

    const total = exercises.length;
    const percentScore = Math.round((correct / total) * 100);

    setScore({ correct, total });
    setSubmitted(true);

    // Thêm vào lịch sử local
    setHistory(prev => [
      ...prev,
      { score: percentScore, date: new Date().toLocaleDateString() },
    ]);
  };

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
        <ActivityIndicator size="large" color="#2196f3" />
        <Text>Đang tải bài tập...</Text>
      </View>
    );
  }

  if (!exercises.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Chưa có bài tập cho bài học này</Text>
      </View>
    );
  }

  const optionLabels = ['A', 'B', 'C', 'D'];

  /* =========================
     RENDER
  ========================= */
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      {exercises.map((ex, idx) => (
        <View key={ex._id} style={styles.card}>
          <Text style={styles.qIndex}>Câu {idx + 1}</Text>
          <Text style={styles.question}>{ex.question}</Text>

          <View style={{ marginTop: 10 }}>
            {ex.type === 'multiple-choice' ? (
              // Bài tập trắc nghiệm
              ex.options?.map((opt, optIdx) => {
                const label = optionLabels[optIdx];
                const chosen = answers[ex._id] === label;
                const isCorrect = submitted && label === ex.correct_answer;
                const isWrong = submitted && chosen && !isCorrect;

                return (
                  <TouchableOpacity
                    key={label}
                    activeOpacity={0.8}
                    style={[
                      styles.option,
                      chosen && styles.optionChosen,
                      isCorrect && styles.optionCorrect,
                      isWrong && styles.optionWrong,
                    ]}
                    onPress={() => handleChoose(ex._id, label)}
                  >
                    <Text style={styles.optionText}>
                      {label}: {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              // Bài tập điền từ
              <>
                <TextInput
                  style={[
                    styles.fillInInput,
                    submitted && answers[ex._id] === ex.correct_answer && styles.fillInInputCorrect,
                    submitted && answers[ex._id] !== ex.correct_answer && answers[ex._id] && styles.fillInInputWrong,
                  ]}
                  placeholder="Nhập câu trả lời..."
                  value={answers[ex._id] || ''}
                  onChangeText={(text) => !submitted && handleChoose(ex._id, text)}
                  editable={!submitted}
                  placeholderTextColor="#999"
                />
                {submitted &&
                answers[ex._id] &&
                answers[ex._id] !== ex.correct_answer && (
                  <Text style={styles.correctAnswerText}>
                    Đáp án đúng: {ex.correct_answer}
                  </Text>
                )}
              </>
            )}
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
                Kết quả: {score.correct}/{score.total} câu đúng ({Math.round((score.correct / score.total) * 100)}%)
              </Text>
            </View>
          )
        )}
      </View>

      {/* =========================
          HISTORY BÀI HỌC LOCAL
      ========================= */}
      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>📖 Kết quả bài này</Text>
        {history.map((h, idx) => (
          <View key={idx} style={styles.historyCard}>
            <Text>Điểm: {h.score}%</Text>
            <Text>Ngày: {h.date}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  error: { color: '#e74c3c', fontSize: 16 },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    padding: 14,
    elevation: 2,
  },
  qIndex: { color: '#2196f3', fontWeight: '700', marginBottom: 8 },
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

  fillInInput: {
    backgroundColor: '#f0f2f5',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 8,
    fontSize: 16,
    color: '#2c3e50',
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  fillInInputCorrect: {
    backgroundColor: '#c8e6c9',
    borderColor: '#27ae60',
  },
  fillInInputWrong: {
    backgroundColor: '#ffcdd2',
    borderColor: '#e74c3c',
  },
  correctAnswerText: {
    marginTop: 6,
    fontSize: 14,
    color: '#27ae60',
    fontStyle: 'italic',
  },


  footer: { paddingHorizontal: 16, paddingVertical: 16 },
  submitBtn: { backgroundColor: '#27ae60', borderRadius: 10, alignItems: 'center', paddingVertical: 12 },
  submitText: { color: '#fff', fontWeight: '700' },

  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  resultText: { color: '#2c3e50', fontWeight: '700' },

  historySection: { paddingHorizontal: 16, marginTop: 20 },
  historyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  historyCard: { backgroundColor: '#f0f7ff', padding: 12, borderRadius: 8, marginBottom: 10 },
});
