import { Stack } from 'expo-router';
import { VocabularyProvider } from '../../../src/context/VocabularyContext';
import { LessonVocabularyProvider } from '../../../src/context/LessonVocabularyContext';
import { ExerciseProvider } from '@/src/context/ExcerciseContext';

export default function AdminLayout() {
  return (
    <VocabularyProvider>
      <LessonVocabularyProvider>
        <ExerciseProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#2980b9' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Admin Dashboard' }} />
          <Stack.Screen name="lesson/add-lesson" options={{ title: 'Thêm Bài Học' }} />
          <Stack.Screen name="lesson/edit-lesson" options={{ title: 'Chỉnh Sửa Bài Học' }} />
          <Stack.Screen name="lesson/lessons-list" options={{ title: 'Quản Lý Bài Học' }} />
        </Stack>
        </ExerciseProvider>
      </LessonVocabularyProvider>
    </VocabularyProvider>
  );
}
