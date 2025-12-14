// app/(main)/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SavedLessonsProvider } from '../../src/context/SavedLessonsContext';

export default function MainLayout() {
  const { signOut } = useAuth();

  return (
    <SavedLessonsProvider>
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
    </SavedLessonsProvider>
  );
}