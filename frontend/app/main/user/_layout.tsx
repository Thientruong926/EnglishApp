import React from 'react';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, useAuth } from '../../../src/context/AuthContext';
import { LessonProvider } from '../../../src/context/LessonContext';
import { SavedLessonsProvider } from '../../../src/context/SavedLessonsContext';
import { ExerciseProvider } from '@/src/context/ExcerciseContext';
import { LessonVocabularyProvider } from '@/src/context/LessonVocabularyContext';
import { UserVocabularyProvider } from '@/src/context/UserVocabularyContext';
import { UserFolderProvider } from '@/src/context/UserFolderContext';

export default function MainLayout() {
  const { signOut } = useAuth();

  return (
<LessonProvider>
  <UserVocabularyProvider>
    <UserFolderProvider>
      <LessonVocabularyProvider>
        <SavedLessonsProvider>
          <ExerciseProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#fff' },
            headerTintColor: '#333',
            headerTitleStyle: { fontWeight: 'bold' },
            headerRight: () => (
              <TouchableOpacity onPress={signOut} style={{ marginRight: 15 }}>
                <Ionicons name="log-out-outline" size={24} color="red" />
              </TouchableOpacity>
            ),
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Danh sách bài học' }} />
          <Stack.Screen name="reading/[id]" options={{ title: 'Đọc hiểu' }} />
          <Stack.Screen name="exercise/[id]" options={{ title: 'Bài tập' }} />
          <Stack.Screen name="VocabularyRepository/vocabulary" options={{ title: 'Kho Từ Vựng' }} />
          <Stack.Screen name="SavedLessons/saved-lessons" options={{ title: 'Bài Đã Lưu' }} />
        </Stack>
 </ExerciseProvider>
        </SavedLessonsProvider>
      </LessonVocabularyProvider>
    </UserFolderProvider>
  </UserVocabularyProvider>
</LessonProvider>
  );
}
