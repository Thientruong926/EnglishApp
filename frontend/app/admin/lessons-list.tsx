import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const API_BASE_URL = 'http://10.0.2.2:5001/api';

interface Lesson {
    _id: string;
    title: string;
    topic: string;
    content: string;
    image_url?: string;
}

const LessonsListScreen = () => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/lessons`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setLessons(data);
        } catch (error) {
            Alert.alert('Lỗi', `Không thể tải danh sách bài học: ${error}`);
            console.error('Error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchLessons();
    };

    const handleDeleteLesson = (lesson: Lesson) => {
        Alert.alert('Xóa Bài Học', `Bạn có chắc chắn muốn xóa bài: "${lesson.title}"?`, [
            { text: 'Hủy', onPress: () => { } },
            {
                text: 'Xóa',
                onPress: async () => {
                    try {
                        const response = await fetch(`${API_BASE_URL}/lessons/${lesson._id}`, {
                            method: 'DELETE',
                        });
                        if (!response.ok) throw new Error('Failed to delete');
                        Alert.alert('Thành công', 'Bài học đã được xóa');
                        fetchLessons();
                    } catch (error) {
                        Alert.alert('Lỗi', `Không thể xóa bài học: ${error}`);
                        console.error('Error:', error);
                    }
                },
                style: 'destructive',
            },
        ]);
    };

    const renderLessonItem = ({ item }: { item: Lesson }) => (
        <View style={styles.lessonCard}>
            {item.image_url && (
                <Image
                    source={{ uri: item.image_url }}
                    style={styles.lessonImage}
                />
            )}
            <View style={styles.cardContent}>
                <View style={styles.lessonInfo}>
                    <Text style={styles.lessonTitle} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <Text style={styles.lessonTopic}>{item.topic}</Text>
                    <Text style={styles.lessonContent} numberOfLines={2}>
                        {item.content}
                    </Text>
                </View>
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() =>
                            router.push({
                                pathname: '/admin/edit-lesson',
                                params: { id: item._id },
                            })
                        }
                    >
                        <Ionicons name="pencil" size={18} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteLesson(item)}
                    >
                        <Ionicons name="trash" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2980b9" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={lessons}
                renderItem={renderLessonItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-outline" size={48} color="#bdc3c7" />
                        <Text style={styles.emptyText}>Không có bài học nào</Text>
                    </View>
                }
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/admin/add-lesson')}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 12,
        paddingBottom: 80,
    },
    lessonCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lessonImage: {
        width: '100%',
        height: 140,
        backgroundColor: '#e9ecef',
    },
    cardContent: {
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    lessonInfo: {
        flex: 1,
        marginRight: 12,
    },
    lessonTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 4,
    },
    lessonTopic: {
        fontSize: 12,
        color: '#2980b9',
        fontWeight: '600',
        marginBottom: 6,
    },
    lessonContent: {
        fontSize: 12,
        color: '#7f8c8d',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    editButton: {
        backgroundColor: '#f39c12',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#27ae60',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 64,
    },
    emptyText: {
        fontSize: 16,
        color: '#bdc3c7',
        marginTop: 12,
    },
});

export default LessonsListScreen;
