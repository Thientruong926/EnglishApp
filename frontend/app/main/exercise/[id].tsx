// app/main/exercise/[id].tsx
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { EXERCISES } from '../../../src/data/mockData';
import { Exercise } from '../../../src/types';

export default function ExerciseScreen() {
    const params = useLocalSearchParams();
    const idParam = params.id as string | undefined;
    const lessonId = idParam ? Number(idParam) : NaN;

    const exercises: Exercise[] = useMemo(() => {
        if (!Number.isNaN(lessonId)) {
            return EXERCISES.filter(ex => ex.lesson_id === lessonId);
        }
        return [];
    }, [lessonId]);

    const [answers, setAnswers] = useState<Record<number, number | string>>({});
    const [submitted, setSubmitted] = useState(false);

    if (!idParam || Number.isNaN(lessonId)) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>Thiếu ID bài học để làm bài tập.</Text>
            </View>
        );
    }

    if (!exercises.length) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>Chưa có bài tập cho bài học này.</Text>
            </View>
        );
    }

    const handleChoose = (ex: Exercise, optionIndex: number) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [ex.exercise_id]: optionIndex }));
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    const score = useMemo(() => {
        if (!submitted) return null;
        const correct = exercises.reduce((acc, ex) => acc + (answers[ex.exercise_id] === ex.correct_answer ? 1 : 0), 0);
        return { correct, total: exercises.length };
    }, [submitted, exercises, answers]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
            <View style={styles.header}>
                <Text style={styles.title}>Bài tập</Text>
                <Text style={styles.sub}>Bài học #{lessonId} • {exercises.length} câu hỏi</Text>
            </View>

            {exercises.map((ex, idx) => (
                <View key={ex.exercise_id} style={styles.card}>
                    <Text style={styles.qIndex}>Câu {idx + 1}</Text>
                    <Text style={styles.question}>{ex.question}</Text>
                    <View style={{ marginTop: 10 }}>
                        {ex.options?.map((opt, optIdx) => {
                            const chosen = answers[ex.exercise_id] === optIdx;
                            const isCorrect = submitted && optIdx === ex.correct_answer;
                            const isWrongChoice = submitted && chosen && !isCorrect;
                            return (
                                <TouchableOpacity
                                    key={optIdx}
                                    activeOpacity={0.8}
                                    style={[
                                        styles.option,
                                        chosen && styles.optionChosen,
                                        isCorrect && styles.optionCorrect,
                                        isWrongChoice && styles.optionWrong,
                                    ]}
                                    onPress={() => handleChoose(ex, optIdx)}
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
                            <Text style={styles.resultText}>Kết quả: {score.correct}/{score.total} câu đúng</Text>
                        </View>
                    )
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    error: { color: '#e74c3c', fontSize: 16 },
    header: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 8 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },
    sub: { color: '#7f8c8d', marginTop: 6 },
    card: { backgroundColor: '#fff', marginHorizontal: 16, marginVertical: 10, borderRadius: 12, padding: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
    qIndex: { color: '#2196f3', fontWeight: '700', marginBottom: 8 },
    question: { fontSize: 16, color: '#2c3e50' },
    option: { backgroundColor: '#f0f2f5', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, marginTop: 8 },
    optionChosen: { backgroundColor: '#c8e6c9' },
    optionCorrect: { backgroundColor: '#c8e6c9' },
    optionWrong: { backgroundColor: '#ffcdd2' },
    optionText: { color: '#34495e' },
    explain: { marginTop: 10, color: '#7f8c8d', fontStyle: 'italic' },
    footer: { paddingHorizontal: 16, paddingVertical: 16 },
    submitBtn: { backgroundColor: '#27ae60', borderRadius: 10, alignItems: 'center', paddingVertical: 12 },
    submitText: { color: '#fff', fontWeight: '700' },
    resultBox: { backgroundColor: '#fff', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
    resultText: { color: '#2c3e50', fontWeight: '700' },
});

