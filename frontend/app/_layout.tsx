// app/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext'; // Import AuthProvider

export default function Layout() {
  return (
    // Bọc AuthProvider ở ngoài cùng
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Màn hình Welcome */}
        <Stack.Screen name="index" />
        
        {/* Nhóm màn hình Auth */}
        <Stack.Screen name="auth/login" options={{ presentation: 'modal' }} />
        <Stack.Screen name="auth/register" />
        
        {/* Nhóm màn hình chính */}
        <Stack.Screen name="main" />
        <Stack.Screen name="main/reading/[id]" options={{ title: "Bài đọc" }} />
        <Stack.Screen name="main/exercise/[id]" options={{ title: "Bài tập" }} />
      </Stack>
    </AuthProvider>
  );
}