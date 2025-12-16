import { Stack } from 'expo-router';

export default function AdminLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#2980b9',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Admin Dashboard' }} />
            <Stack.Screen name="add-lesson" options={{ title: 'Thêm Bài Học' }} />
            <Stack.Screen name="edit-lesson" options={{ title: 'Chỉnh Sửa Bài Học' }} />
            <Stack.Screen name="lessons-list" options={{ title: 'Quản Lý Bài Học' }} />
        </Stack>
    );
}
