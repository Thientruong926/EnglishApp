// app/main/reading/[id].tsx
import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LESSONS } from '../../../src/data/mockData';
import { Lesson } from '../../../src/types';

export default function ReadingDetail() {
    const params = useLocalSearchParams();
    const idParam = params.id as string | undefined;
    const id = idParam ? Number(idParam) : NaN;

    const lesson: Lesson | undefined = LESSONS.find(l => l.lesson_id === id);
    const [canStartExercise, setCanStartExercise] = useState(false);

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
        const threshold = 24; // px from bottom to consider "finished"
        const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - threshold;
        if (isAtBottom) setCanStartExercise(true);
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
            <Text style={styles.body}>{lesson.content}</Text>

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
    body: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, fontSize: 16, lineHeight: 24, color: '#34495e', backgroundColor: '#fff' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    error: { color: '#e74c3c', fontSize: 16 },
    footer: { paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#f8f9fa' },
    ctaBtn: { backgroundColor: '#27ae60', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
    ctaBtnDisabled: { backgroundColor: '#a5d6a7' },
    ctaText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    helper: { marginTop: 8, color: '#7f8c8d', fontSize: 12, textAlign: 'center' },
});

