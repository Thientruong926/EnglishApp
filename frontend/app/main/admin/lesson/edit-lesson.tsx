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
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useLessonVocabulary } from '@/src/context/LessonVocabularyContext';
import { useExercise } from '@/src/context/ExcerciseContext';
import { useVocabulary } from '@/src/context/VocabularyContext';
import { Lesson } from '@/src/context/LessonContext';
import { Vocabulary } from '@/src/context/VocabularyContext';
import { Exercise } from '@/src/context/ExcerciseContext';

const API_BASE_URL = 'http://10.0.2.2:5001/api';

const EditLessonScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState('');
    const [image_url, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [vocabWord, setVocabWord] = useState('');
    const [vocabMeaning, setVocabMeaning] = useState('');
    const [vocabExample, setVocabExample] = useState('');
    const [editingVocabIndex, setEditingVocabIndex] = useState<number | null>(null);

    type ExerciseType = "multiple-choice" | "fill-in";
    const [question, setQuestion] = useState('');
    const [optionA, setOptionA] = useState('');
    const [optionB, setOptionB] = useState('');
    const [optionC, setOptionC] = useState('');
    const [optionD, setOptionD] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [type, setType] = useState<ExerciseType>("multiple-choice");
    const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);

    const { addVocab } = useVocabulary();
    const { addLessonVocab, fetchVocabsByLesson } = useLessonVocabulary();

    const {
        exercises: exercisesFromContext,
        fetchExercisesByLesson,
        addExercise,
    } = useExercise();

    const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);

    useEffect(() => {
        if (id) {
            fetchLesson();
            fetchLessonVocabularies();
            loadExercises();
        }
    }, [id]);

    useEffect(() => {
        setExercises(exercisesFromContext);
    }, [exercisesFromContext]);

    const fetchLessonVocabularies = async () => {
        if (!id) return;

        const lessonVocabs = await fetchVocabsByLesson(id);

        const vocabList: Vocabulary[] = lessonVocabs.map((lv: any) => ({
            _id: lv.vocab_id._id,
            word: lv.vocab_id.word,
            meaning: lv.vocab_id.meaning,
            example_sentence: lv.vocab_id.example_sentence,
        }));

        setVocabularies(vocabList);
    };

    const loadExercises = async () => {
        if (!id) return;
        try {
            await fetchExercisesByLesson(id);
        } catch (err) {
            console.warn('Không thể tải bài tập:', err);
        }
    };

    const fetchLesson = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/lessons/${id}`);
            if (!response.ok) throw new Error('Failed to fetch');
            const lesson: Lesson = await response.json();
            setTitle(lesson.title);
            setTopic(lesson.topic || '');
            setContent(lesson.content);
            setImageUrl(lesson.image_url || '');
        } catch (error) {
            Alert.alert('Lỗi', `Không thể tải bài học: ${error}`);
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const resetVocabForm = () => {
        setVocabWord('');
        setVocabMeaning('');
        setVocabExample('');
        setEditingVocabIndex(null);
    };

    const resetExerciseForm = () => {
        setQuestion('');
        setOptionA('');
        setOptionB('');
        setOptionC('');
        setOptionD('');
        setCorrectAnswer('');
        setType('multiple-choice');
        setEditingExerciseIndex(null);
    };

    const addVocabularyToList = async () => {
        if (!id) return;
        if (!vocabWord.trim() || !vocabMeaning.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập từ vựng và nghĩa');
            return;
        }
        try {
            const vocab = await addVocab(
                vocabWord.trim(),
                vocabMeaning.trim(),
                vocabExample.trim()
            );
            if (!vocab) return;
            const ok = await addLessonVocab(id, vocab._id);
            if (!ok) return;
            await fetchLessonVocabularies();
            resetVocabForm();
        } catch {
            Alert.alert('Lỗi', 'Không thể thêm từ vựng');
        }
    };

const addExerciseToList = async () => {
    if (!id) return;
    if (!question.trim() || !correctAnswer.trim()) {
        Alert.alert("Lỗi", "Thiếu câu hỏi hoặc đáp án đúng");
        return;
    }

    const payload = {
        question: question.trim(),
        type,
        options:
            type === "multiple-choice"
                ? [optionA, optionB, optionC, optionD].filter(Boolean)
                : undefined,
        correct_answer: correctAnswer.trim(),
    };

    if (editingExerciseIndex !== null) {
        // đang chỉnh sửa
        const exerciseToEdit = exercises[editingExerciseIndex];
        const ok = await updateExercise(exerciseToEdit._id, payload);
        if (ok) {
            setExercises(prev =>
                prev.map((e, idx) =>
                    idx === editingExerciseIndex ? { ...e, ...payload } : e
                )
            );
            resetExerciseForm();
        } else {
            Alert.alert('Lỗi', 'Không thể cập nhật bài tập');
        }
    } else {
        // thêm mới
        const exercise = await addExercise(id, payload);
        if (!exercise) return;
        setExercises(prev => [...prev, exercise]);
        resetExerciseForm();
    }
};

    const handleEditVocab = (index: number) => {
        const vocab = vocabularies[index];
        setVocabWord(vocab.word);
        setVocabMeaning(vocab.meaning);
        setVocabExample(vocab.example_sentence || '');
        setEditingVocabIndex(index);
    };

    const handleDeleteVocab = (index: number) => {
        setVocabularies(prev => prev.filter((_, idx) => idx !== index));
        resetVocabForm();
    };

    const handleEditExercise = (index: number) => {
        const exercise = exercises[index];
        setQuestion(exercise.question);
        setCorrectAnswer(exercise.correct_answer);
        setType(exercise.type as ExerciseType);
        setOptionA(exercise.options?.[0] || '');
        setOptionB(exercise.options?.[1] || '');
        setOptionC(exercise.options?.[2] || '');
        setOptionD(exercise.options?.[3] || '');
        setEditingExerciseIndex(index);
    };

const { deleteExercise, updateExercise } = useExercise();

const handleDeleteExercise = async (index: number) => {
    const exercise = exercises[index];
    if (!exercise) return;

    Alert.alert(
        'Xác nhận',
        'Bạn có chắc muốn xóa bài tập này?',
        [
            { text: 'Hủy', style: 'cancel' },
            {
                text: 'Xóa',
                style: 'destructive',
                onPress: async () => {
                    const ok = await deleteExercise(exercise._id);
                    if (ok) {
                        setExercises(prev => prev.filter((_, idx) => idx !== index));
                        resetExerciseForm();
                    } else {
                        Alert.alert('Lỗi', 'Không thể xóa bài tập');
                    }
                }
            }
        ]
    );
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    topic: topic.trim(),
                    content: content.trim(),
                    image_url: image_url.trim() || 'https://via.placeholder.com/300x200?text=Lesson',
                }),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            await fetch(`${API_BASE_URL}/lessons/${id}/exercises`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ exercises }),
            });

            Alert.alert('Thành công', 'Bài học đã được cập nhật', [
                {
                    text: 'OK',
                    onPress: () => router.push('/main/admin/lesson/lessons-list'),
                },
            ]);
        } catch (error) {
            Alert.alert('Lỗi', `Không thể cập nhật bài học: ${error}`);
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
                {/* --- Lesson info --- */}
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
                    placeholder="Nhập chủ đề"
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
                    placeholder="Nhập URL hình ảnh"
                    value={image_url}
                    onChangeText={setImageUrl}
                    editable={!saving}
                />

                {/* --- Vocabulary --- */}
                <Text style={styles.sectionHeader}>Chỉnh Sửa Từ Vựng</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Từ vựng"
                    value={vocabWord}
                    onChangeText={setVocabWord}
                    editable={!saving}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nghĩa"
                    value={vocabMeaning}
                    onChangeText={setVocabMeaning}
                    editable={!saving}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Ví dụ câu"
                    value={vocabExample}
                    onChangeText={setVocabExample}
                    editable={!saving}
                />
                <TouchableOpacity style={styles.smallButton} onPress={addVocabularyToList} disabled={saving}>
                    <Text style={styles.smallButtonText}>
                        {editingVocabIndex !== null ? 'Cập nhật từ vựng' : '+ Thêm từ vựng'}
                    </Text>
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
                                    <TouchableOpacity style={styles.editIconBtn} onPress={() => handleEditVocab(idx)} disabled={saving}>
                                        <Ionicons name="pencil" size={16} color="#f39c12" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.deleteIconBtn} onPress={() => handleDeleteVocab(idx)} disabled={saving}>
                                        <Ionicons name="trash" size={16} color="#e74c3c" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* --- Exercises --- */}
                <Text style={styles.sectionHeader}>Chỉnh Sửa Bài Tập</Text>

                <Text style={styles.label}>Loại bài tập</Text>
                <View style={styles.typeRow}>
                    <TouchableOpacity
                        style={[styles.typeChip, type === 'multiple-choice' && styles.typeChipActive]}
                        onPress={() => setType('multiple-choice')}
                        disabled={saving}
                    >
                        <Text style={[styles.typeText, type === 'multiple-choice' && styles.typeTextActive]}>Trắc nghiệm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeChip, type === 'fill-in' && styles.typeChipActive]}
                        onPress={() => setType('fill-in')}
                        disabled={saving}
                    >
                        <Text style={[styles.typeText, type === 'fill-in' && styles.typeTextActive]}>Điền từ</Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Câu hỏi"
                    value={question}
                    onChangeText={setQuestion}
                    editable={!saving}
                />

                {type === 'multiple-choice' && (
                    <View>
                        <Text style={styles.label}>Các đáp án</Text>
                        <TextInput style={styles.input} placeholder="Đáp án A" value={optionA} onChangeText={setOptionA} editable={!saving} />
                        <TextInput style={styles.input} placeholder="Đáp án B" value={optionB} onChangeText={setOptionB} editable={!saving} />
                        <TextInput style={styles.input} placeholder="Đáp án C" value={optionC} onChangeText={setOptionC} editable={!saving} />
                        <TextInput style={styles.input} placeholder="Đáp án D" value={optionD} onChangeText={setOptionD} editable={!saving} />
                    </View>
                )}

                <Text style={styles.label}>Đáp án đúng *</Text>
                <TextInput style={styles.input} placeholder="Ví dụ: A hoặc từ khoá" value={correctAnswer} onChangeText={setCorrectAnswer} editable={!saving} />

                <TouchableOpacity style={styles.smallButton} onPress={addExerciseToList} disabled={saving}>
                    <Text style={styles.smallButtonText}>
                        {editingExerciseIndex !== null ? 'Cập nhật bài tập' : '+ Thêm bài tập'}
                    </Text>
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
                                        {e.options?.length ? `\n🔹 ${e.options.join(' | ')}` : ''}
                                    </Text>
                                </View>
                                <View style={styles.listItemActions}>
                                    <TouchableOpacity style={styles.editIconBtn} onPress={() => handleEditExercise(idx)} disabled={saving}>
                                        <Ionicons name="pencil" size={16} color="#f39c12" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.deleteIconBtn} onPress={() => handleDeleteExercise(idx)} disabled={saving}>
                                        <Ionicons name="trash" size={16} color="#e74c3c" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.submitButton, saving && styles.submitButtonDisabled]}
                    onPress={handleUpdateLesson}
                    disabled={saving}
                >
                    {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Cập Nhật Bài Học</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()} disabled={saving}>
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
        marginBottom: 10,
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
    sectionHeader: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2c3e50',
        marginTop: 16,
        marginBottom: 8,
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

export default EditLessonScreen;
