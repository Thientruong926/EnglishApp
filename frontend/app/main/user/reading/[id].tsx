import React, { useEffect, useState, JSX } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  GestureResponderEvent,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useLessonVocabulary } from '../../../../src/context/LessonVocabularyContext';
import { useVocabulary, Vocabulary } from '../../../../src/context/VocabularyContext';
import { Lesson, useLesson } from '../../../../src/context/LessonContext';
import { useUserFolder, UserFolder } from '../../../../src/context/UserFolderContext';
import { useAuth } from '@/src/context/AuthContext';
import { useUserVocabulary } from '@/src/context/UserVocabularyContext';

export default function ReadingDetail() {
  const { user } = useAuth();
  const user_id = user?.id; // lấy user_id từ AuthContext
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getLessonById } = useLesson();
  const { fetchVocabsByLesson } = useLessonVocabulary();
  const { vocabs: allVocabs } = useVocabulary();
  const { folders, fetchFolders } = useUserFolder();
  const { addUserVocab } = useUserVocabulary();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [vocabs, setVocabs] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);

  const [canStartExercise, setCanStartExercise] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectionPoint, setSelectionPoint] = useState<{ x: number; y: number; initialScrollY: number } | null>(null);
  const [showFolderSelector, setShowFolderSelector] = useState<{ vocab: Vocabulary } | null>(null);

  // Fetch lesson + vocabs + folders
  useEffect(() => {
    if (!id || Array.isArray(id)) return;
    if (!user_id) return; // chờ user load

    const fetchData = async () => {
      setLoading(true);
      try {
        const lessonData = await getLessonById(id);
        if (lessonData) {
          setLesson(lessonData);

          // Fetch vocab cho bài học
          const lessonVocabLinks = await fetchVocabsByLesson(id);
          const lessonVocabs = lessonVocabLinks
            .map((lv: any) =>
              typeof lv.vocab_id === 'object' && lv.vocab_id !== null
                ? lv.vocab_id
                : allVocabs.find(v => v._id === lv.vocab_id)
            )
            .filter(Boolean) as Vocabulary[];

          setVocabs(lessonVocabs);
        }

        // Fetch folder của user
        await fetchFolders();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, allVocabs, user_id]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    setScrollY(contentOffset.y);

    const threshold = 24;
    if (contentOffset.y + layoutMeasurement.height >= contentSize.height - threshold) {
      setCanStartExercise(true);
    }
  };

  // Highlight từ trong đoạn văn
  const renderHighlightedParagraph = (text: string, index: number) => {
    const vocabWords = vocabs.map(v => v.word.toLowerCase());
    const vocabPattern = vocabWords.length > 0 ? new RegExp(`\\b(${vocabWords.join('|')})\\b`, 'gi') : null;

    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    if (vocabPattern) {
      let match;
      while ((match = vocabPattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(
            <Text key={`t-${index}-${lastIndex}`} style={styles.body}>
              {text.substring(lastIndex, match.index)}
            </Text>
          );
        }

        const word = match[0];
        const isSelected = selectedWord?.toLowerCase() === word.toLowerCase();

        parts.push(
          <Text
            key={`w-${index}-${match.index}`}
            style={[styles.highlightedWord, isSelected && styles.selectedWord]}
            onLongPress={(e: GestureResponderEvent) => {
              const { pageX, pageY } = e.nativeEvent;
              setSelectedWord(word);
              setSelectionPoint({ x: pageX, y: pageY - 32, initialScrollY: scrollY });
            }}
          >
            {word}
          </Text>
        );

        lastIndex = vocabPattern.lastIndex;
      }
    }

    if (lastIndex < text.length) {
      parts.push(
        <Text key={`end-${index}`} style={styles.body}>
          {text.substring(lastIndex)}
        </Text>
      );
    }

    return (
      <Text style={{ marginBottom: 12 }}>
        {parts.map((part, idx) => React.cloneElement(part, { key: part.key || idx }))}
      </Text>
    );
  };

  const parseParagraphs = (html: string): string[] =>
    html
      .replace(/\r?\n|\r/g, '')
      .split(/<\/p>/i)
      .map(p => p.replace(/<p[^>]*>/i, '').replace(/<\/?[^>]+(>|$)/g, '').trim())
      .filter(Boolean);

  // Xử lý thêm từ vựng
  const handleAddVocab = (vocab: Vocabulary) => {
    if (folders.length === 0) {
      Alert.alert("Chưa có folder nào", "Vui lòng tạo folder trước khi thêm từ vựng.");
      return;
    }
    setShowFolderSelector({ vocab });
  };

  const selectFolder = async (folder: UserFolder) => {
    if (!showFolderSelector) return;
    const vocab = showFolderSelector.vocab;

    try {
      // ✅ Chỉ truyền vocab_id và folder_id
      await addUserVocab(vocab._id, folder._id);
      Alert.alert("Thành công", `Đã thêm "${vocab.word}" vào folder "${folder.name}"`);
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể thêm từ vào folder");
    }

    setShowFolderSelector(null);
    setSelectedWord(null);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Đang tải bài học...</Text>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Không tìm thấy bài học</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 24 }}
        onScroll={handleScroll}
        scrollEventThrottle={32}
      >
        <Image source={{ uri: lesson.image_url }} style={styles.cover} />

        <View style={styles.meta}>
          <Text style={styles.topic}>{lesson.topic}</Text>
          <Text style={styles.title}>{lesson.title}</Text>
        </View>

        <View style={styles.content}>
          {parseParagraphs(lesson.content).map((para, index) => renderHighlightedParagraph(para, index))}
        </View>

        {vocabs.length > 0 && (
          <View style={styles.vocabSection}>
            <Text style={styles.vocabTitle}>📚 Từ vựng</Text>
            {vocabs.map(v => (
              <View key={v._id} style={styles.vocabCard}>
                <Text style={styles.vocabWord}>{v.word}</Text>
                <Text>{v.meaning}</Text>
                {v.example_sentence && (
                  <Text style={styles.vocabExample}>Ví dụ: {v.example_sentence}</Text>
                )}

                <TouchableOpacity
                  style={styles.addButtonSmall}
                  onPress={() => handleAddVocab(v)}
                >
                  <Text style={{ color: '#fff' }}>＋</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity
            disabled={!canStartExercise}
            style={[styles.ctaBtn, !canStartExercise && styles.ctaBtnDisabled]}
            onPress={() => router.push(`/main/user/exercise/${lesson._id}`)}
          >
            <Text style={styles.ctaText}>
              {canStartExercise ? 'Làm bài tập' : 'Kéo xuống hết để làm bài'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showFolderSelector && (
        <View style={styles.folderSelectorOverlay}>
          <View style={styles.folderSelector}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>Chọn folder để lưu</Text>
            {folders.map(f => (
              <TouchableOpacity key={f._id} onPress={() => selectFolder(f)} style={styles.folderOption}>
                <Text>📁 {f.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowFolderSelector(null)} style={{ marginTop: 12 }}>
              <Text style={{ color: '#e74c3c', fontWeight: '700' }}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  cover: { width: '100%', height: 220 },
  meta: { padding: 16, backgroundColor: '#fff' },
  topic: { color: '#2196f3', fontSize: 12, fontWeight: '700' },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 6 },
  content: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  body: { fontSize: 16, lineHeight: 24, color: '#34495e' },
  highlightedWord: { color: '#2196f3', fontWeight: '700', backgroundColor: '#e3f2fd' },
  selectedWord: { backgroundColor: '#1976d2', color: '#fff' },
  vocabSection: { padding: 16, backgroundColor: '#fff' },
  vocabTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  vocabCard: { backgroundColor: '#f0f7ff', padding: 10, borderRadius: 6, marginBottom: 10 },
  vocabWord: { fontWeight: '700', color: '#2196f3' },
  vocabExample: { fontStyle: 'italic', marginTop: 4 },
  addButtonSmall: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  footer: { padding: 16 },
  ctaBtn: { backgroundColor: '#27ae60', padding: 12, borderRadius: 10, alignItems: 'center' },
  ctaBtnDisabled: { backgroundColor: '#a5d6a7' },
  ctaText: { color: '#fff', fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#e74c3c' },
  folderSelectorOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderSelector: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    width: '80%',
  },
  folderOption: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
