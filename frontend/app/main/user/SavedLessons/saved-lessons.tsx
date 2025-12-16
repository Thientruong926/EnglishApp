import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useSavedLessons } from '@/src/context/SavedLessonsContext';
import { Lesson } from '@/src/context/LessonContext';

/* =========================
   ITEM
========================= */
interface LessonItemProps {
  item: Lesson;
  isSaved: boolean;
  onToggleSave: (lessonId: string) => void;
}

const LessonItem = ({
  item,
  isSaved,
  onToggleSave,
}: LessonItemProps) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => router.push(`/main/user/reading/${item._id}`)}
  >
    {item.image_url && (
      <Image source={{ uri: item.image_url }} style={styles.cardImage} />
    )}

    <TouchableOpacity
      style={styles.bookmarkBtn}
      onPress={() => onToggleSave(item._id)}
    >
      <Ionicons
        name={isSaved ? 'bookmark' : 'bookmark-outline'}
        size={24}
        color="#fff"
      />
    </TouchableOpacity>

    <View style={styles.cardContent}>
      {item.topic && (
        <View style={styles.topicTag}>
          <Text style={styles.topicText}>{item.topic}</Text>
        </View>
      )}

      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.title}
      </Text>
    </View>
  </TouchableOpacity>
);

/* =========================
   SCREEN
========================= */
export default function SavedLessonsScreen() {
  const { savedLessons, toggleSaveLesson, isLessonSaved } =
    useSavedLessons();

  return (
    <View style={styles.container}>
      <FlatList
        data={savedLessons}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <LessonItem
            item={item}
            isSaved={isLessonSaved(item._id)}
            onToggleSave={toggleSaveLesson}
          />
        )}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Bạn chưa lưu bài học nào.
          </Text>
        }
      />
    </View>
  );
}

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontSize: 16,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
  },

  cardImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  bookmarkBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 20,
  },

  cardContent: {
    padding: 16,
  },

  topicTag: {
    backgroundColor: '#e3f2fd',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },

  topicText: {
    color: '#2196f3',
    fontSize: 12,
    fontWeight: 'bold',
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});
