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
import { Ionicons } from '@expo/vector-icons';

const API_BASE_URL = 'http://10.0.2.2:5001/api';

const AddLessonScreen = () => {
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState('');
    const [image_url, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    // Vocab form state
    const [vocabWord, setVocabWord] = useState('');
    const [vocabMeaning, setVocabMeaning] = useState('');
    const [vocabExample, setVocabExample] = useState('');
    const [vocabularies, setVocabularies] = useState<Array<{ word: string; meaning: string; example_sentence: string }>>([]);

    // Exercise form state
    const [question, setQuestion] = useState('');
    const [type, setType] = useState<'multiple_choice' | 'fill-in'>('multiple_choice');
    const [optionA, setOptionA] = useState('');
    const [optionB, setOptionB] = useState('');
    const [optionC, setOptionC] = useState('');
    const [optionD, setOptionD] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [exercises, setExercises] = useState<Array<{ question: string; type: string; options?: string[]; correct_answer: string }>>([]);

    const addVocabularyToList = () => {
        if (!vocabWord.trim() || !vocabMeaning.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập từ và nghĩa');
            return;
        }

        const item = {
            word: vocabWord.trim(),
            meaning: vocabMeaning.trim(),
            example_sentence: vocabExample.trim(),
        };
        setVocabularies((prev) => [item, ...prev]);
        setVocabWord('');
        setVocabMeaning('');
        setVocabExample('');
    };

    const addExerciseToList = () => {
        if (!question.trim() || !correctAnswer.trim() || (type === 'multiple_choice' && (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()))) {
            Alert.alert('Lỗi', 'Vui lòng nhập câu hỏi và đầy đủ thông tin bài tập');
            return;
        }
        const options = type === 'multiple_choice' ? [optionA, optionB, optionC, optionD].filter(Boolean) : undefined;
        const item = {
            question: question.trim(),
            type,
            options,
            correct_answer: correctAnswer.trim(),
        };
        setExercises((prev) => [item, ...prev]);
        setQuestion('');
        setOptionA('');
        setOptionB('');
        setOptionC('');
        setOptionD('');
        setCorrectAnswer('');
    };

    const handleEditVocab = (idx: number) => {
        const vocab = vocabularies[idx];
        setVocabWord(vocab.word);
        setVocabMeaning(vocab.meaning);
        setVocabExample(vocab.example_sentence);
        // Remove from list to re-add after editing
        setVocabularies((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleDeleteVocab = (idx: number) => {
        Alert.alert('Xóa từ vựng', 'Bạn có chắc chắn muốn xóa từ này?', [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Xóa', onPress: () => setVocabularies((prev) => prev.filter((_, i) => i !== idx)), style: 'destructive' },
        ]);
    };

    const handleEditExercise = (idx: number) => {
        const ex = exercises[idx];
        setQuestion(ex.question);
        setType(ex.type as any);
        setCorrectAnswer(ex.correct_answer);
        if (ex.options && ex.options.length >= 4) {
            setOptionA(ex.options[0] || '');
            setOptionB(ex.options[1] || '');
            setOptionC(ex.options[2] || '');
            setOptionD(ex.options[3] || '');
        }
        // Remove from list to re-add after editing
        setExercises((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleDeleteExercise = (idx: number) => {
        Alert.alert('Xóa bài tập', 'Bạn có chắc chắn muốn xóa bài tập này?', [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Xóa', onPress: () => setExercises((prev) => prev.filter((_, i) => i !== idx)), style: 'destructive' },
        ]);
    };

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
            const lessonId = data?.lesson?._id;

            // Gửi vocabularies và exercises đến backend (để backend xử lý logic)
            const promises = [];

            if (lessonId && vocabularies.length > 0) {
                promises.push(
                    fetch(`${API_BASE_URL}/lessons/${lessonId}/vocabularies`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ vocabularies }),
                    }).catch(err => console.warn('Vocabularies error:', err))
                );
            }

            if (lessonId && exercises.length > 0) {
                promises.push(
                    fetch(`${API_BASE_URL}/lessons/${lessonId}/exercises`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ exercises }),
                    }).catch(err => console.warn('Exercises error:', err))
                );
            }

            // Chờ tất cả API calls hoàn thành
            if (promises.length > 0) {
                await Promise.allSettled(promises);
            }

            Alert.alert('Thành công', 'Bài học đã được thêm', [
                {
                    text: 'OK',
                    onPress: () => {
                        setTitle('');
                        setTopic('');
                        setContent('');
                        setImageUrl('');
                        setVocabularies([]);
                        setExercises([]);
                        router.push('/main/admin/lesson/lessons-list');
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
                    placeholder="Nhập tiêu đề bài học (ví dụ: How to improve English skills)"
                    value={title}
                    onChangeText={setTitle}
                    editable={!loading}
                />

                <Text style={styles.label}>Chủ Đề *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập chủ đề (ví dụ: Speaking)"
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

                {/* Vocab Section */}
                <Text style={styles.sectionHeader}>Thêm Từ Vựng</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Từ vựng (ví dụ: apple)"
                    value={vocabWord}
                    onChangeText={setVocabWord}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nghĩa  (ví dụ: quả táo)"
                    value={vocabMeaning}
                    onChangeText={setVocabMeaning}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Ví dụ câu (ví dụ: I eat an apple every day.)"
                    value={vocabExample}
                    onChangeText={setVocabExample}
                />
                <TouchableOpacity style={styles.smallButton} onPress={addVocabularyToList}>
                    <Text style={styles.smallButtonText}>+ Thêm từ vựng</Text>
                </TouchableOpacity>
                {vocabularies.length > 0 && (
                    <View style={styles.listBox}>
                        <Text style={styles.listTitle}>Danh sách từ vựng ({vocabularies.length})</Text>
                        {vocabularies.map((v, idx) => (
                            <View key={`v-${idx}`} style={styles.listItemCard}>
                                <View style={styles.listItemContent}>
                                    <Text style={styles.listItemText}>
                                        <Text style={styles.listItemWord}>{v.word}</Text> : {v.meaning}
                                        {v.example_sentence ? `\n${v.example_sentence}` : ''}
                                    </Text>
                                </View>
                                <View style={styles.listItemActions}>
                                    <TouchableOpacity style={styles.editIconBtn} onPress={() => handleEditVocab(idx)}>
                                        <Ionicons name="pencil" size={16} color="#f39c12" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.deleteIconBtn} onPress={() => handleDeleteVocab(idx)}>
                                        <Ionicons name="trash" size={16} color="#e74c3c" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Exercise Section */}
                <Text style={styles.sectionHeader}>Thêm Bài Tập</Text>

                <Text style={styles.label}>Loại bài tập</Text>
                <View style={styles.typeRow}>
                    <TouchableOpacity style={[styles.typeChip, type === 'multiple_choice' && styles.typeChipActive]} onPress={() => setType('multiple_choice')}>
                        <Text style={[styles.typeText, type === 'multiple_choice' && styles.typeTextActive]}>Trắc nghiệm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.typeChip, type === 'fill-in' && styles.typeChipActive]} onPress={() => setType('fill-in')}>
                        <Text style={[styles.typeText, type === 'fill-in' && styles.typeTextActive]}>Điền từ</Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Câu hỏi"
                    value={question}
                    onChangeText={setQuestion}
                />

                {type === 'multiple_choice' && (
                    <View>
                        <Text style={styles.label}>Các đáp án</Text>
                        <TextInput style={styles.input} placeholder="Đáp án A" value={optionA} onChangeText={setOptionA} />
                        <TextInput style={styles.input} placeholder="Đáp án B" value={optionB} onChangeText={setOptionB} />
                        <TextInput style={styles.input} placeholder="Đáp án C" value={optionC} onChangeText={setOptionC} />
                        <TextInput style={styles.input} placeholder="Đáp án D" value={optionD} onChangeText={setOptionD} />
                    </View>
                )}

                <Text style={styles.label}>Đáp án đúng *</Text>
                <TextInput style={styles.input} placeholder="Ví dụ: A hoặc từ khoá" value={correctAnswer} onChangeText={setCorrectAnswer} />
                <TouchableOpacity style={styles.smallButton} onPress={addExerciseToList}>
                    <Text style={styles.smallButtonText}>+ Thêm bài tập</Text>
                </TouchableOpacity>
                {exercises.length > 0 && (
                    <View style={styles.listBox}>
                        <Text style={styles.listTitle}>Danh sách bài tập ({exercises.length})</Text>
                        {exercises.map((e, idx) => (
                            <View key={`e-${idx}`} style={styles.listItemCard}>
                                <View style={styles.listItemContent}>
                                    <Text style={styles.listItemText}>
                                        <Text style={styles.listItemWord}>{e.question}</Text>
                                        {`\nLoại: ${e.type} | Đáp án: ${e.correct_answer}`}
                                        {e.options && e.options.length ? `\n🔹 ${e.options.join(' | ')}` : ''}
                                    </Text>
                                </View>
                                <View style={styles.listItemActions}>
                                    <TouchableOpacity style={styles.editIconBtn} onPress={() => handleEditExercise(idx)}>
                                        <Ionicons name="pencil" size={16} color="#f39c12" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.deleteIconBtn} onPress={() => handleDeleteExercise(idx)}>
                                        <Ionicons name="trash" size={16} color="#e74c3c" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

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
        marginBottom: 10,
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
    smallButton: {
        backgroundColor: '#2980b9',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    smallButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
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
    sectionHeader: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2c3e50',
        marginTop: 16,
        marginBottom: 8,
    },
    listBox: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 10,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#e1e4e8',
    },
    listTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 6,
    },
    listItem: {
        fontSize: 12,
        color: '#34495e',
        marginBottom: 4,
    },
    listItemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e1e4e8',
    },
    listItemContent: {
        flex: 1,
        marginRight: 8,
    },
    listItemText: {
        fontSize: 12,
        color: '#34495e',
        lineHeight: 18,
    },
    listItemWord: {
        fontWeight: '700',
        color: '#2980b9',
        fontSize: 13,
    },
    listItemActions: {
        flexDirection: 'row',
        gap: 6,
    },
    editIconBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fef5e7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteIconBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fadbd8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    typeRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    typeChip: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 16,
        backgroundColor: '#e9ecef',
    },
    typeChipActive: {
        backgroundColor: '#d6eaff',
        borderWidth: 1,
        borderColor: '#2980b9',
    },
    typeText: {
        fontSize: 12,
        color: '#2c3e50',
        fontWeight: '600',
    },
    typeTextActive: {
        color: '#2980b9',
    },
});

export default AddLessonScreen;
