import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

const API_BASE_URL = 'http://10.0.2.2:5001/api';

interface Lesson {
    _id: string;
    title: string;
    topic: string;
    content: string;
    image_url?: string;
}

const EditLessonScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState('');
    const [image_url, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (id) {
            fetchLesson();
        }
    }, [id]);

    const fetchLesson = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/lessons/${id}`);
            if (!response.ok) throw new Error('Failed to fetch');
            const lesson: Lesson = await response.json();
            setTitle(lesson.title);
            setTopic(lesson.topic);
            setContent(lesson.content);
            setImageUrl(lesson.image_url || '');
        } catch (error) {
            Alert.alert('Lỗi', `Không thể tải bài học: ${error}`);
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateLesson = async () => {
        if (!title.trim() || !topic.trim() || !content.trim()) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bài học');
            return;
        }

        setSaving(true);
        try {
            const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title.trim(),
                    topic: topic.trim(),
                    content: content.trim(),
                    image_url: image_url.trim() || 'https://via.placeholder.com/300x200?text=Lesson',
                }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            Alert.alert('Thành công', 'Bài học đã được cập nhật', [
                {
                    text: 'OK',
                    onPress: () => {
                        router.push('/main/admin/lessons-list');
                    },
                },
            ]);
        } catch (error) {
            Alert.alert('Lỗi', `Không thể cập nhật bài học: ${error}`);
            console.error('Error:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2980b9" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.formSection}>
                <Text style={styles.label}>Tiêu Đề Bài Học *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập tiêu đề bài học"
                    value={title}
                    onChangeText={setTitle}
                    editable={!saving}
                />

                <Text style={styles.label}>Chủ Đề *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập chủ đề (ví dụ: Business English)"
                    value={topic}
                    onChangeText={setTopic}
                    editable={!saving}
                />

                <Text style={styles.label}>Nội Dung *</Text>
                <TextInput
                    style={[styles.input, styles.textarea]}
                    placeholder="Nhập nội dung bài học"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    numberOfLines={6}
                    editable={!saving}
                />

                <Text style={styles.label}>URL Hình Ảnh</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập URL hình ảnh (tùy chọn)"
                    value={image_url}
                    onChangeText={setImageUrl}
                    editable={!saving}
                />

                <TouchableOpacity
                    style={[styles.submitButton, saving && styles.submitButtonDisabled]}
                    onPress={handleUpdateLesson}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Cập Nhật Bài Học</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                    disabled={saving}
                >
                    <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
    contentContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    formSection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#bdc3c7',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: '#2c3e50',
        backgroundColor: '#f8f9fa',
    },
    textarea: {
        height: 120,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#f39c12',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
    },
    submitButtonDisabled: {
        backgroundColor: '#95a5a6',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EditLessonScreen;
