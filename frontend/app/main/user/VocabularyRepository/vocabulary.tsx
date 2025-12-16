import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Vocabulary } from '../../../../src/types';
import { Ionicons } from '@expo/vector-icons';


const VocabularyItem = ({ item }: { item: Vocabulary }) => (
  <View style={styles.itemContainer}>
    <View style={styles.wordHeader}>
      <Text style={styles.word}>{item.word}</Text>
    </View>
    <Text style={styles.meaning}>- {item.meaning}</Text>
    <Text style={styles.sentence}>VD: "{item.ex_sentence}"</Text>
  </View>
);

export default function VocabularyScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={VOCABULARIES}
        renderItem={({ item }) => <VocabularyItem item={item} />}
        keyExtractor={(item) => item.vocabulary_id.toString()}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Ionicons name="book-outline" size={28} color="#2980b9" />
            <Text style={styles.headerTitle}>Từ Vựng Đã Lưu</Text>
            <Text style={styles.headerSubtitle}>
              Tổng hợp tất cả các từ bạn đã lưu từ các bài học.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Bạn chưa lưu từ vựng nào.</Text>
        }
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  listContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#95a5a6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  wordHeader: {
    marginBottom: 6,
  },
  word: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2980b9',
  },
  meaning: {
    fontSize: 16,
    color: '#34495e',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  sentence: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusLearned: {
    backgroundColor: '#e6f7e9',
  },
  statusNotLearned: {
    backgroundColor: '#fef5e7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#95a5a6',
  },
});