import React, { useEffect, useMemo, useState, JSX } from 'react';
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
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

import { Lesson } from '../../../../src/context/LessonContext';
import { useLesson } from '../../../../src/context/LessonContext';

/* =========================
   COMPONENT
========================= */
export default function ReadingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getLessonById } = useLesson();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [vocabs, setVocabs] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);

  const [canStartExercise, setCanStartExercise] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectionPoint, setSelectionPoint] = useState<{
    x: number;
    y: number;
    initialScrollY: number;
  } | null>(null);

  /* =========================
     FETCH DATA FROM API
  ========================= */
  useEffect(() => {
    if (!id) return;

    const fetchLesson = async () => {
      setLoading(true);
      const data = await getLessonById(id);

      if (data) {
        setLesson(data);
        setVocabs(data.vocabularies || []);
      }

      setLoading(false);
    };

    fetchLesson();
  }, [id]);

  /* =========================
     SCROLL CHECK
  ========================= */
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    setScrollY(contentOffset.y);

    const threshold = 24;
    const isAtBottom =
      contentOffset.y + layoutMeasurement.height >=
      contentSize.height - threshold;

    if (isAtBottom) setCanStartExercise(true);
  };

  /* =========================
     RENDER CONTENT WITH HIGHLIGHT
  ========================= */
  const renderHighlightedParagraph = (text: string, index: number) => {
    const vocabWords = vocabs.map(v => v.word.toLowerCase());

    const vocabPattern =
      vocabWords.length > 0
        ? new RegExp(`\\b(${vocabWords.join('|')})\\b`, 'gi')
        : null;

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
        const isSelected =
          selectedWord?.toLowerCase() === word.toLowerCase();

        parts.push(
          <Text
            key={`w-${index}-${match.index}`}
            style={[
              styles.highlightedWord,
              isSelected && styles.selectedWord,
            ]}
            onLongPress={(e: GestureResponderEvent) => {
              const { pageX, pageY } = e.nativeEvent;
              setSelectedWord(word);
              setSelectionPoint({
                x: pageX,
                y: pageY - 32,
                initialScrollY: scrollY,
              });
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
        {parts}
      </Text>
    );
  };

  const parseParagraphs = (html: string): string[] => {
    return html
      .replace(/\r?\n|\r/g, '') // bỏ newline
      .split(/<\/p>/i)
      .map(p =>
        p
          .replace(/<p[^>]*>/i, '')
          .replace(/<\/?[^>]+(>|$)/g, '')
          .trim()
      )
      .filter(Boolean);
  };


  /* =========================
     UI STATES
  ========================= */
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

  /* =========================
     RENDER
  ========================= */
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
          {parseParagraphs(lesson.content).map((para, index) =>
            renderHighlightedParagraph(para, index)
          )}
        </View>


        {vocabs.length > 0 && (
          <View style={styles.vocabSection}>
            <Text style={styles.vocabTitle}>📚 Từ vựng</Text>
            {vocabs.map(v => (
              <View key={v._id} style={styles.vocabCard}>
                <Text style={styles.vocabWord}>{v.word}</Text>
                <Text>{v.meaning}</Text>
                {v.example_sentence && (
                  <Text style={styles.vocabExample}>
                    Ví dụ: {v.example_sentence}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity
            disabled={!canStartExercise}
            style={[
              styles.ctaBtn,
              !canStartExercise && styles.ctaBtnDisabled,
            ]}
            onPress={() =>
              router.push(`/main/user/exercise/${lesson._id}`)
            }
          >
            <Text style={styles.ctaText}>
              {canStartExercise
                ? 'Làm bài tập'
                : 'Kéo xuống hết để làm bài'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {selectionPoint && (
        <View
          style={[
            styles.addContainer,
            {
              top:
                selectionPoint.y -
                (scrollY - selectionPoint.initialScrollY),
              left: selectionPoint.x - 24,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setSelectionPoint(null);
              setSelectedWord(null);
            }}
          >
            <Text style={styles.addButtonText}>＋</Text>
          </TouchableOpacity>
          <Text style={styles.addHint}>Thêm từ vựng</Text>
        </View>
      )}
    </View>
  );
}

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  cover: { width: '100%', height: 220 },
  meta: { padding: 16, backgroundColor: '#fff' },
  topic: { color: '#2196f3', fontSize: 12, fontWeight: '700' },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 6 },

  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },

  body: { fontSize: 16, lineHeight: 24, color: '#34495e' },
  highlightedWord: {
    color: '#2196f3',
    fontWeight: '700',
    backgroundColor: '#e3f2fd',
  },
  selectedWord: {
    backgroundColor: '#1976d2',
    color: '#fff',
  },

  vocabSection: { padding: 16, backgroundColor: '#fff' },
  vocabTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  vocabCard: {
    backgroundColor: '#f0f7ff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  vocabWord: { fontWeight: '700', color: '#2196f3' },
  vocabExample: { fontStyle: 'italic', marginTop: 4 },

  footer: { padding: 16 },
  ctaBtn: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaBtnDisabled: { backgroundColor: '#a5d6a7' },
  ctaText: { color: '#fff', fontWeight: '700' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#e74c3c' },

  addContainer: { position: 'absolute', flexDirection: 'row', gap: 8 },
  addButton: {
    backgroundColor: '#2196f3',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 20 },
  addHint: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
  },
});
