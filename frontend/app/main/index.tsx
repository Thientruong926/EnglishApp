// app/(main)/index.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Import dữ liệu và context
import { useAuth } from '../../src/context/AuthContext';
import { LESSONS } from '../../src/data/mockData';
import { Lesson } from '../../src/types';

export default function HomeScreen() {
  const { user } = useAuth();

  // Hàm render cho từng thẻ bài học
  const renderLessonItem = ({ item }: { item: Lesson }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.9}
      // Khi bấm vào thì chuyển sang màn hình Reading kèm ID bài học
      onPress={() => router.push(`/main/reading/${item.lesson_id}`)}
    >
      {/* Ảnh bìa bài học */}
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      
      {/* Thông tin bài học */}
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
      
      {/* Phần Header: Lời chào */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Xin chào, {user?.name || "Bạn mới"} 👋</Text>
          <Text style={styles.subGreeting}>Sẵn sàng học từ vựng mới chưa?</Text>
        </View>
        {/* Ảnh Avatar nhỏ ở góc (nếu có) */}
        {user?.avatar && (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        )}
      </View>

      {/* Danh sách bài học */}
      <Text style={styles.sectionTitle}>Bài học đề xuất</Text>
      
      <FlatList
        data={LESSONS}
        keyExtractor={(item) => item.lesson_id.toString()}
        renderItem={renderLessonItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        // Gợi ý: Nếu danh sách rỗng thì hiện thông báo
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>Chưa có bài học nào.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingHorizontal: 20 },
  
  // Header Styles
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 25 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },
  subGreeting: { fontSize: 14, color: '#7f8c8d', marginTop: 4 },
  avatar: { width: 45, height: 45, borderRadius: 22.5, borderWidth: 2, borderColor: '#fff' },
  
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },

  // List Styles
  listContainer: { paddingBottom: 20 },
  
  // Card Styles
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    marginBottom: 20, 
    // Tạo bóng đổ nhẹ (Shadow)
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 4 
  },
  cardImage: { width: '100%', height: 180, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  cardContent: { padding: 16 },
  topicTag: { 
    backgroundColor: '#e3f2fd', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 6, 
    marginBottom: 8 
  },
  topicText: { color: '#2196f3', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 8, lineHeight: 24 },
  metaInfo: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 12, color: '#7f8c8d' }
});