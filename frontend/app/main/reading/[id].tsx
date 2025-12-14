// app/main/reading/[id].tsx
import React, { useState, useMemo, JSX } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LESSONS, VOCABULARIES } from '../../../src/data/mockData';
import { Lesson, Vocabulary } from '../../../src/types';

export default function ReadingDetail() {
    const params = useLocalSearchParams();
    const idParam = params.id as string | undefined;
    const id = idParam ? Number(idParam) : NaN;

    const lesson: Lesson | undefined = LESSONS.find(l => l.lesson_id === id);
    const vocabs: Vocabulary[] = useMemo(() =>
        VOCABULARIES.filter(v => v.lesson_id === id),
        [id]
    );
    const [canStartExercise, setCanStartExercise] = useState(false);

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
        const threshold = 24; // px from bottom to consider "finished"
        const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - threshold;
        if (isAtBottom) setCanStartExercise(true);
    };

    // Hàm highlight từ vựng trong content
    const renderHighlightedContent = (text: string) => {
        if (vocabs.length === 0) {
            return <Text style={styles.body}>{text}</Text>;
        }

        // Tạo regex để tìm tất cả từ vựng (case-insensitive, word boundary)
        const vocabWords = vocabs.map(v => v.word.toLowerCase());
        const pattern = new RegExp(`\\b(${vocabWords.join('|')})\\b`, 'gi');

        const parts: JSX.Element[] = [];
        let lastIndex = 0;
        let match;
        let keyIndex = 0;

        while ((match = pattern.exec(text)) !== null) {
            // Text trước từ vocab
            if (match.index > lastIndex) {
                parts.push(
                    <Text key={`text-${keyIndex++}`} style={styles.body}>
                        {text.substring(lastIndex, match.index)}
                    </Text>
                );
            }
            // Từ vocab được highlight
            parts.push(
                <Text key={`vocab-${keyIndex++}`} style={styles.highlightedWord}>
                    {match[0]}
                </Text>
            );
            lastIndex = pattern.lastIndex;
        }

        // Text còn lại sau từ vocab cuối
        if (lastIndex < text.length) {
            parts.push(
                <Text key={`text-${keyIndex++}`} style={styles.body}>
                    {text.substring(lastIndex)}
                </Text>
            );
        }

        return <Text style={styles.body}>{parts}</Text>;
    };

    if (!idParam || Number.isNaN(id)) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>Thiếu tham số bài đọc.</Text>
            </View>
        );
    }

    if (!lesson) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>Không tìm thấy bài đọc với ID {id}.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} onScroll={handleScroll} scrollEventThrottle={32}>
            <Image source={{ uri: lesson.image }} style={styles.cover} />
            <View style={styles.meta}>
                <Text style={styles.topic}>{lesson.topic}</Text>
                <Text style={styles.title}>{lesson.title}</Text>
            </View>
            <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, backgroundColor: '#fff' }}>
                {renderHighlightedContent(lesson.content)}
            </View>

            {vocabs.length > 0 && (
                <View style={styles.vocabSection}>
                    <Text style={styles.vocabTitle}>📚 Từ vựng</Text>
                    {vocabs.map((vocab) => (
                        <View key={vocab.vocabulary_id} style={styles.vocabCard}>
                            <Text style={styles.vocabWord}>{vocab.word}</Text>
                            <Text style={styles.vocabMeaning}>{vocab.meaning}</Text>
                            <Text style={styles.vocabExample}>Ví dụ: {vocab.ex_sentence}</Text>
                        </View>
                    ))}
                </View>
            )}

            <View style={styles.footer}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.ctaBtn, !canStartExercise && styles.ctaBtnDisabled]}
                    onPress={() => router.push(`/main/exercise/${id}`)}
                    disabled={!canStartExercise}
                >
                    <Text style={styles.ctaText}>{canStartExercise ? 'Làm bài tập' : 'Kéo xuống hết để làm bài'}</Text>
                </TouchableOpacity>
                {!canStartExercise && (
                    <Text style={styles.helper}>Mẹo: kéo hết bài đọc để mở khóa bài tập.</Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    contentContainer: { paddingBottom: 24 },
    cover: { width: '100%', height: 220 },
    meta: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff' },
    topic: { color: '#2196f3', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
    title: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50', marginTop: 6 },
    body: { fontSize: 16, lineHeight: 24, color: '#34495e' },
    highlightedWord: { fontSize: 16, lineHeight: 24, color: '#2196f3', fontWeight: '700', backgroundColor: '#e3f2fd' },
    vocabSection: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
    vocabTitle: { fontSize: 18, fontWeight: '700', color: '#2c3e50', marginBottom: 12 },
    vocabCard: { backgroundColor: '#f0f7ff', borderLeftWidth: 4, borderLeftColor: '#2196f3', paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10, borderRadius: 6 },
    vocabWord: { fontSize: 16, fontWeight: '700', color: '#2196f3' },
    vocabMeaning: { fontSize: 14, color: '#2c3e50', marginTop: 4 },
    vocabExample: { fontSize: 13, color: '#7f8c8d', marginTop: 6, fontStyle: 'italic' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    error: { color: '#e74c3c', fontSize: 16 },
    footer: { paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#f8f9fa' },
    ctaBtn: { backgroundColor: '#27ae60', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
    ctaBtnDisabled: { backgroundColor: '#a5d6a7' },
    ctaText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    helper: { marginTop: 8, color: '#7f8c8d', fontSize: 12, textAlign: 'center' },
});

