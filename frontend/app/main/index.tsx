//Giao diện chính sau khi đăng nhập

// app/(main)/index.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useMemo } from 'react';
import { useSavedLessons } from '../../src/context/SavedLessonsContext';

// Import dữ liệu và context
import { useAuth } from '../../src/context/AuthContext';
import { LESSONS } from '../../src/data/mockData';
import { Lesson } from '../../src/types';

export default function HomeScreen() {
  const { user } = useAuth();

  const [selectedTopic, setSelectedTopic] = useState('All');
  const topics = useMemo(() => ['All', ...new Set(LESSONS.map(lesson => lesson.topic))], []);
  const filteredLessons = useMemo(() => {
    if (selectedTopic === 'All') {
      return LESSONS;
    }
    return LESSONS.filter(lesson => lesson.topic === selectedTopic);
  }, [selectedTopic]);

  const { toggleSaveLesson, isLessonSaved } = useSavedLessons();

  // Render từng item bài học
  const renderLessonItem = ({ item }: { item: Lesson }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/main/reading/${item.lesson_id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />

      <TouchableOpacity 
        style={styles.bookmarkBtn} 
        onPress={() => toggleSaveLesson(item.lesson_id)}
      >
        <Ionicons 
          name={isLessonSaved(item.lesson_id) ? "bookmark" : "bookmark-outline"} 
          size={24} 
          color="#fff" 
        />
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <View style={styles.topicTag}>
          <Text style={styles.topicText}>{item.topic}</Text>
        </View>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.metaInfo}>
          <Ionicons name="time-outline" size={14} color="#7f8c8d" />
          <Text style={styles.timeText}> 5 phút đọc</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Xin chào, {user?.name || "Bạn mới"} 👋</Text>
          <Text style={styles.subGreeting}>Hôm nay bạn muốn học gì?</Text>
        </View>
        {user?.avatar && (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        )}
      </View>

      {/* --- MENU CHỨC NĂNG (GRID 2x2) --- */}
      <View style={styles.actionContainer}>
        {/* Hàng 1 */}
        <View style={styles.actionRow}>
          {/* Nút 1: Kho Từ Vựng */}
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => router.push('/main/VocabularyRepository/vocabulary')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#e3f2fd' }]}>
              <Ionicons name="book" size={22} color="#2196f3" />
            </View>
            <Text style={styles.actionTitle}>Kho từ vựng</Text>
          </TouchableOpacity>

          {/* Nút 2: Ôn tập */}
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => router.push('/main/practice')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#fff3e0' }]}>
              <Ionicons name="school" size={22} color="#ff9800" />
            </View>
            <Text style={styles.actionTitle}>Ôn tập ngay</Text>
          </TouchableOpacity>
        </View>

        {/* Hàng 2 */}
        <View style={styles.actionRow}>
          {/* Nút 3: Bài đã lưu */}
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => router.push('/main/SavedLessons/saved-lessons')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#fce4ec' }]}>
              <Ionicons name="bookmark" size={22} color="#e91e63" />
            </View>
            <Text style={styles.actionTitle}>Bài đã lưu</Text>
          </TouchableOpacity>

          {/* Nút 4: Thêm từ */}
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => router.push('/main/add-word')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#e8f5e9' }]}>
              <Ionicons name="add-circle" size={22} color="#27ae60" />
            </View>
            <Text style={styles.actionTitle}>Thêm từ mới</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* ------------------------------------------- */}
      

      {/*filter*/}
      <View style={styles.filterContainer}>
        <FlatList
          data={topics}
          renderItem={({ item }) => (
            <TouchableOpacity
                style={[
                    styles.topicButton,
                    selectedTopic === item && styles.topicButtonSelected
                ]}
                onPress={() => setSelectedTopic(item)}
            >
                <Text style={[
                    styles.topicButtonText,
                    selectedTopic === item && styles.topicButtonTextSelected
                ]}>
                    {item}
                </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>


      <Text style={styles.sectionTitle}>Bài học đề xuất</Text>
      <FlatList
        data={filteredLessons}
        keyExtractor={(item) => item.lesson_id.toString()}
        renderItem={renderLessonItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Chưa có bài học nào.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingHorizontal: 20 },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },
  subGreeting: { fontSize: 14, color: '#7f8c8d', marginTop: 4 },
  avatar: { width: 45, height: 45, borderRadius: 22.5, borderWidth: 2, borderColor: '#fff' },
  
  // --- STYLE CHO MENU GRID 2x2 (Đã sửa lại) ---
  actionContainer: {
    marginBottom: 20,
    gap: 12, // Khoảng cách giữa các hàng (React Native bản mới hỗ trợ)
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12, // Fallback cho bản cũ nếu gap không chạy
  },
  actionBtn: {
    width: '48%', // Chia đôi màn hình
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    elevation: 2, // Bóng đổ Android nhẹ nhàng
    shadowColor: '#000', // Bóng đổ iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    flexDirection: 'row', // Icon bên trái, chữ bên phải
    alignItems: 'center', // Căn giữa theo chiều dọc
  },
  
  // Style chung cho vòng tròn Icon
  iconCircle: {
    width: 38, 
    height: 38, 
    borderRadius: 12, // Bo góc mềm mại hơn (squircle) thay vì tròn xoe
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 10, // Khoảng cách với chữ
  },
  
  actionTitle: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#333',
    flex: 1, // Để chữ tự xuống dòng nếu dài quá
  },
  // ------------------------------------

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  listContainer: { paddingBottom: 40 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999' },

  // Card Bài học
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    marginBottom: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 4 
  },
  cardImage: { width: '100%', height: 180, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  cardContent: { padding: 16 },
  topicTag: { backgroundColor: '#e3f2fd', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 8 },
  topicText: { color: '#2196f3', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 8, lineHeight: 24 },
  metaInfo: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 12, color: '#7f8c8d' },


  filterContainer: {
    marginBottom: 20,
  },
  topicButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  topicButtonSelected: {
    backgroundColor: '#2196f3',
    borderColor: '#2196f3',
  },
  topicButtonText: {
    color: '#495057',
    fontWeight: '500',
  },
  topicButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
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