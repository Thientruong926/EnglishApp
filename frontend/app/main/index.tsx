// app/(main)/index.tsx

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../src/context/AuthContext';
import { useSavedLessons } from '../../src/context/SavedLessonsContext';
import { useLesson, Lesson } from '../../src/context/LessonContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const { toggleSaveLesson, isLessonSaved } = useSavedLessons();
  const { lessons, isLoading, fetchLessons } = useLesson();

  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    fetchLessons();
  }, []);

  /* =========================
     TOPICS
  ========================= */
  const topics = useMemo(() => {
    return ['All', ...new Set(lessons.map(l => l.topic).filter(Boolean))];
  }, [lessons]);

  /* =========================
     FILTER
  ========================= */
  const filteredLessons = useMemo(() => {
    if (selectedTopic === 'All') return lessons;
    return lessons.filter(l => l.topic === selectedTopic);
  }, [selectedTopic, lessons]);

  /* =========================
     RENDER ITEM
  ========================= */
  const renderLessonItem = ({ item }: { item: Lesson }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/main/reading/${item._id}`)}
    >
      {item.image_url && (
        <Image source={{ uri: item.image_url }} style={styles.cardImage} />
      )}

      <TouchableOpacity
        style={styles.bookmarkBtn}
        onPress={() => toggleSaveLesson(item._id)}
      >
        <Ionicons
          name={isLessonSaved(item._id) ? 'bookmark' : 'bookmark-outline'}
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Xin chào, {user?.name || 'Bạn mới'} 👋
          </Text>
          <Text style={styles.subGreeting}>Hôm nay bạn muốn học gì?</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => router.push('/admin')}
            style={styles.adminButton}
          >
            <Ionicons name="settings" size={20} color="#2980b9" />
          </TouchableOpacity>
          {user?.avatar && (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          )}
        </View>
      </View>

      {/* MENU */}
      <View style={styles.actionContainer}>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() =>
              router.push('/main/VocabularyRepository/vocabulary')
            }
          >
            <View style={[styles.iconCircle, { backgroundColor: '#e3f2fd' }]}>
              <Ionicons name="book" size={22} color="#2196f3" />
            </View>
            <Text style={styles.actionTitle}>Kho từ vựng</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('/main/practice')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#fff3e0' }]}>
              <Ionicons name="school" size={22} color="#ff9800" />
            </View>
            <Text style={styles.actionTitle}>Ôn tập ngay</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('/main/SavedLessons/saved-lessons')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#fce4ec' }]}>
              <Ionicons name="bookmark" size={22} color="#e91e63" />
            </View>
            <Text style={styles.actionTitle}>Bài đã lưu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('/main/add-word')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#e8f5e9' }]}>
              <Ionicons name="add-circle" size={22} color="#27ae60" />
            </View>
            <Text style={styles.actionTitle}>Thêm từ mới</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FILTER */}
      <View style={styles.filterContainer}>
        <FlatList
          data={topics}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.topicButton,
                selectedTopic === item && styles.topicButtonSelected,
              ]}
              onPress={() => setSelectedTopic(item)}
            >
              <Text
                style={[
                  styles.topicButtonText,
                  selectedTopic === item &&
                    styles.topicButtonTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* LIST */}
      <Text style={styles.sectionTitle}>Bài học đề xuất</Text>
      <FlatList
        data={filteredLessons}
        keyExtractor={item => item._id}
        renderItem={renderLessonItem}
        refreshing={isLoading}
        onRefresh={fetchLessons}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {isLoading ? 'Đang tải...' : 'Chưa có bài học nào'}
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
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingHorizontal: 20 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },
  subGreeting: { fontSize: 14, color: '#7f8c8d', marginTop: 4 },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: '#fff',
  },

  actionContainer: { marginBottom: 20 },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionBtn: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  actionTitle: { fontSize: 13, fontWeight: '600', color: '#333', flex: 1 },

  filterContainer: { marginBottom: 20 },
  topicButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    marginRight: 10,
  },
  topicButtonSelected: { backgroundColor: '#2196f3' },
  topicButtonText: { color: '#495057' },
  topicButtonTextSelected: { color: '#fff', fontWeight: 'bold' },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  listContainer: { paddingBottom: 40 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },

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
  cardContent: { padding: 16 },
  topicTag: {
    backgroundColor: '#e3f2fd',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  topicText: { color: '#2196f3', fontSize: 12, fontWeight: 'bold' },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  bookmarkBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 20,
  },
});
