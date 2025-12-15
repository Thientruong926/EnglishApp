// app/main/reading/[id].tsx
import React, { useState, useMemo, JSX } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent, GestureResponderEvent, Pressable } from 'react-native';
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
    const [selectionPoint, setSelectionPoint] = useState<{ x: number; y: number; initialScrollY: number } | null>(null);
    const [scrollY, setScrollY] = useState(0);
    const [selectedWord, setSelectedWord] = useState<string | null>(null);

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
        setScrollY(contentOffset.y);
        const threshold = 24; // px from bottom to consider "finished"
        const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - threshold;
        if (isAtBottom) setCanStartExercise(true);
    };

    // Hàm highlight từ vựng trong content và xử lý long-press
    const renderHighlightedContent = (text: string) => {
        // Tạo regex để tìm tất cả từ vựng (case-insensitive, word boundary)
        const vocabWords = vocabs.map(v => v.word.toLowerCase());
        const vocabPattern = vocabs.length > 0 ? new RegExp(`\\b(${vocabWords.join('|')})\\b`, 'gi') : null;

        // Tìm tất cả vị trí của vocab trong text để highlight
        const vocabMatches: Array<{ start: number; end: number; text: string }> = [];
        if (vocabPattern) {
            let match;
            while ((match = vocabPattern.exec(text)) !== null) {
                vocabMatches.push({
                    start: match.index,
                    end: vocabPattern.lastIndex,
                    text: match[0]
                });
            }
        }

        const parts: JSX.Element[] = [];
        let lastIndex = 0;
        let keyIndex = 0;

        // Helper function để tokenize và render text thường (không phải vocab)
        const renderNormalText = (normalText: string, startKey: number) => {
            const tokens = normalText.match(/\w+|\s+|[^\w\s]+/g) || [normalText];
            const elements: JSX.Element[] = [];

            tokens.forEach((token, idx) => {
                const isWord = /^\w+$/.test(token);
                const isSelected = isWord && selectedWord !== null && token.toLowerCase() === selectedWord.toLowerCase();

                if (isWord) {
                    const tokenStyle: any = isSelected ? [styles.body, styles.selectedWord] : styles.body;
                    elements.push(
                        <Text
                            key={`word-${startKey + idx}`}
                            style={tokenStyle}
                                onLongPress={(e: GestureResponderEvent) => {
                                setSelectedWord(token);
                                const { pageX, pageY } = e.nativeEvent;
                                    setSelectionPoint({ x: pageX, y: pageY - 32, initialScrollY: scrollY });
                            }}
                        >
                            {token}
                        </Text>
                    );
                } else {
                    elements.push(
                        <Text key={`text-${startKey + idx}`} style={styles.body}>
                            {token}
                        </Text>
                    );
                }
            });

            return elements;
        };

        // Render theo thứ tự: text thường -> vocab -> text thường -> vocab...
        vocabMatches.forEach((vm, vmIdx) => {
            // Render text trước vocab match
            if (vm.start > lastIndex) {
                const normalText = text.substring(lastIndex, vm.start);
                parts.push(...renderNormalText(normalText, keyIndex));
                keyIndex += (normalText.match(/\w+|\s+|[^\w\s]+/g) || []).length;
            }

            // Render vocab match (có thể là cụm từ)
            const isSelected = selectedWord !== null && vm.text.toLowerCase() === selectedWord.toLowerCase();
            const vocabStyle: any = isSelected
                ? [styles.body, styles.highlightedWord, styles.selectedWord]
                : styles.highlightedWord;

            parts.push(
                <Text
                    key={`vocab-${vmIdx}`}
                    style={vocabStyle}
                    onLongPress={(e: GestureResponderEvent) => {
                        setSelectedWord(vm.text);
                        const { pageX, pageY } = e.nativeEvent;
                        setSelectionPoint({ x: pageX, y: pageY - 32, initialScrollY: scrollY });
                    }}
                >
                    {vm.text}
                </Text>
            );

            lastIndex = vm.end;
            keyIndex++;
        });

        // Render text còn lại sau vocab match cuối
        if (lastIndex < text.length) {
            const remainingText = text.substring(lastIndex);
            parts.push(...renderNormalText(remainingText, keyIndex));
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
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} onScroll={handleScroll} scrollEventThrottle={32}>
                <Image source={{ uri: lesson.image }} style={styles.cover} />
                <View style={styles.meta}>
                    <Text style={styles.topic}>{lesson.topic}</Text>
                    <Text style={styles.title}>{lesson.title}</Text>
                </View>
                <View
                    style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, backgroundColor: '#fff' }}
                >
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

            {selectionPoint && (
                <View
                    style={[
                        styles.addContainer,
                        {
                            top: selectionPoint.y - (scrollY - selectionPoint.initialScrollY),
                            left: selectionPoint.x - 24,
                        },
                    ]}
                > 
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.addButton}
                        onPress={() => {
                            setSelectionPoint(null);
                            setSelectedWord(null);
                        }}
                    >
                        <Text style={styles.addButtonText}>＋</Text>
                    </TouchableOpacity>
                    <Text style={styles.addHint}>Thêm từ vựng</Text>
                </View>
            )}
        </View>
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
    selectedWord: { backgroundColor: '#1976d2', color: '#ffffff', fontWeight: '800' },
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
    addContainer: { position: 'absolute', flexDirection: 'row', alignItems: 'center', gap: 8 },
    addButton: { backgroundColor: '#2196f3', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
    addButtonText: { color: '#fff', fontSize: 20, fontWeight: '800', lineHeight: 20 },
    addHint: { backgroundColor: '#fff', color: '#2c3e50', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, fontSize: 12 },
});

