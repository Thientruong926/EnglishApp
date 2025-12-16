import React, { useState } from 'react';
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
import { router } from 'expo-router';

const API_BASE_URL = 'http://10.0.2.2:5001/api';

const AddLessonScreen = () => {
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState('');
    const [image_url, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddLesson = async () => {
        if (!title.trim() || !topic.trim() || !content.trim()) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bài học');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/lessons`, {
                method: 'POST',
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            Alert.alert('Thành công', 'Bài học đã được thêm', [
                {
                    text: 'OK',
                    onPress: () => {
                        setTitle('');
                        setTopic('');
                        setContent('');
                        setImageUrl('');
                        router.push('/admin/lessons-list');
                    },
                },
            ]);
        } catch (error) {
            Alert.alert('Lỗi', `Không thể thêm bài học: ${error}`);
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.formSection}>
                <Text style={styles.label}>Tiêu Đề Bài Học *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập tiêu đề bài học"
                    value={title}
                    onChangeText={setTitle}
                    editable={!loading}
                />

                <Text style={styles.label}>Chủ Đề *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập chủ đề (ví dụ: Business English)"
                    value={topic}
                    onChangeText={setTopic}
                    editable={!loading}
                />

                <Text style={styles.label}>Nội Dung *</Text>
                <TextInput
                    style={[styles.input, styles.textarea]}
                    placeholder="Nhập nội dung bài học"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    numberOfLines={6}
                    editable={!loading}
                />

                <Text style={styles.label}>URL Hình Ảnh</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập URL hình ảnh (tùy chọn)"
                    value={image_url}
                    onChangeText={setImageUrl}
                    editable={!loading}
                />

                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleAddLesson}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Thêm Bài Học</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                    disabled={loading}
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
        backgroundColor: '#27ae60',
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

export default AddLessonScreen;
