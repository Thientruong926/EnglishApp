import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useSavedLessons } from '../../../src/context/SavedLessonsContext';
import { LESSONS } from '../../../src/data/mockData';
import { Lesson } from '../../../src/types';


interface LessonItemProps {
  item: Lesson;
  isSaved: boolean;
  onToggleSave: (lessonId: number) => void;
}
    
const LessonItem = ({ item, isSaved, onToggleSave }: LessonItemProps) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/main/reading/${item.lesson_id}`)}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <TouchableOpacity style={styles.bookmarkBtn} onPress={() => onToggleSave(item.lesson_id)}>
            <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.cardContent}>
            <View style={styles.topicTag}><Text style={styles.topicText}>{item.topic}</Text></View>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        </View>
    </TouchableOpacity>
);

export default function SavedLessonsScreen() {
  const { savedLessonIds, isLessonSaved, toggleSaveLesson } = useSavedLessons();

  const savedLessons = LESSONS.filter(lesson => savedLessonIds.has(lesson.lesson_id));

  return (
    <View style={styles.container}>
      <FlatList
        data={savedLessons}
        renderItem={({ item }) => (
            <LessonItem 
                item={item}
                isSaved={isLessonSaved(item.lesson_id)}
                onToggleSave={toggleSaveLesson}
            />
        )}
        keyExtractor={(item) => item.lesson_id.toString()}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
            <Text style={styles.emptyText}>Bạn chưa lưu bài học nào.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },
    card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 20, elevation: 4 },
    cardImage: { width: '100%', height: 180, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
    bookmarkBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 20 },
    cardContent: { padding: 16 },
    topicTag: { backgroundColor: '#e3f2fd', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 8 },
    topicText: { color: '#2196f3', fontSize: 12, fontWeight: 'bold' },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
});