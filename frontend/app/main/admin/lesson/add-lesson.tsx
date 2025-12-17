import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';

import { useVocabulary } from '@/src/context/VocabularyContext';
import { useLessonVocabulary } from '@/src/context/LessonVocabularyContext';

const API_BASE_URL = 'http://10.0.2.2:5001/api';

const AddLessonScreen = () => {
  const { addVocab } = useVocabulary();
  const { addLessonVocab } = useLessonVocabulary();

  // Lesson
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // Vocabulary
  const [vocabWord, setVocabWord] = useState('');
  const [vocabMeaning, setVocabMeaning] = useState('');
  const [vocabExample, setVocabExample] = useState('');

  const [vocabIds, setVocabIds] = useState<string[]>([]);
  const [vocabList, setVocabList] = useState<
    { _id: string; word: string; meaning: string }[]
  >([]);

  // ===== ADD VOCAB =====
  const addVocabularyToList = async () => {
    if (!vocabWord || !vocabMeaning) {
      Alert.alert('Lỗi', 'Thiếu từ hoặc nghĩa');
      return;
    }

    const vocab = await addVocab(vocabWord, vocabMeaning, vocabExample);
    if (!vocab) return;

    setVocabIds(prev => [...prev, vocab._id]);
    setVocabList(prev => [
      { _id: vocab._id, word: vocab.word, meaning: vocab.meaning },
      ...prev,
    ]);

    setVocabWord('');
    setVocabMeaning('');
    setVocabExample('');
  };

  // ===== PUBLISH LESSON =====
  const handlePublishLesson = async () => {
    if (!title || !topic || !content) {
      Alert.alert('Lỗi', 'Thiếu thông tin bài học');
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create lesson
      const res = await fetch(`${API_BASE_URL}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, topic, content }),
      });

      const data = await res.json();
      const lessonId = data?.lesson?._id;

      if (!lessonId) throw new Error('Không tạo được lesson');

      // 2️⃣ Link lesson ↔ vocab
      for (const vocabId of vocabIds) {
        await addLessonVocab(lessonId, vocabId);
      }

      Alert.alert('Thành công', 'Xuất bản bài học thành công', [
        { text: 'OK', onPress: () => router.push('/main/admin/lesson/lessons-list') },
      ]);
    } catch (err: any) {
      Alert.alert('Lỗi', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Tiêu đề</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Chủ đề</Text>
      <TextInput style={styles.input} value={topic} onChangeText={setTopic} />

      <Text style={styles.label}>Nội dung</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        multiline
        value={content}
        onChangeText={setContent}
      />

      <Text style={styles.section}>Từ vựng</Text>
      <TextInput
        style={styles.input}
        placeholder="Word"
        value={vocabWord}
        onChangeText={setVocabWord}
      />
      <TextInput
        style={styles.input}
        placeholder="Meaning"
        value={vocabMeaning}
        onChangeText={setVocabMeaning}
      />
      <TextInput
        style={styles.input}
        placeholder="Example"
        value={vocabExample}
        onChangeText={setVocabExample}
      />

      <TouchableOpacity style={styles.smallBtn} onPress={addVocabularyToList}>
        <Text style={styles.btnText}>+ Thêm từ</Text>
      </TouchableOpacity>

      {vocabList.map(v => (
        <Text key={v._id}>• {v.word} – {v.meaning}</Text>
      ))}

      <TouchableOpacity
        style={styles.publishBtn}
        onPress={handlePublishLesson}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Xuất bản bài học</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddLessonScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  label: { fontWeight: '600', marginTop: 12 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginTop: 6 },
  textarea: { height: 100 },
  section: { fontSize: 16, fontWeight: '700', marginTop: 20 },
  smallBtn: { backgroundColor: '#2980b9', padding: 10, borderRadius: 8, marginTop: 10 },
  publishBtn: { backgroundColor: '#27ae60', padding: 14, borderRadius: 8, marginTop: 24 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
