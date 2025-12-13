// app/main/reading/[id].tsx
import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LESSONS } from '../../../src/data/mockData';
import { Lesson } from '../../../src/types';

export default function ReadingDetail() {
    const params = useLocalSearchParams();
    const idParam = params.id as string | undefined;
    const id = idParam ? Number(idParam) : NaN;

    const lesson: Lesson | undefined = LESSONS.find(l => l.lesson_id === id);

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
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Image source={{ uri: lesson.image }} style={styles.cover} />
            <View style={styles.meta}>
                <Text style={styles.topic}>{lesson.topic}</Text>
                <Text style={styles.title}>{lesson.title}</Text>
            </View>
            <Text style={styles.body}>{lesson.content}</Text>
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
});

