import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const AdminDashboard = () => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <Ionicons name="shield-checkmark" size={48} color="#2980b9" />
                <Text style={styles.headerTitle}>Admin Dashboard</Text>
                <Text style={styles.headerSubtitle}>Quản lý nội dung bài học</Text>
            </View>

            <View style={styles.menuSection}>
                <TouchableOpacity
                    style={[styles.menuCard, styles.addCard]}
                    onPress={() => router.push('/main/main/admin/lesson/add-lesson')}
                >
                    <Ionicons name="add-circle-outline" size={40} color="#27ae60" />
                    <Text style={styles.menuTitle}>Thêm Bài Học</Text>
                    <Text style={styles.menuDesc}>Tạo bài học mới</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.menuCard, styles.editCard]}
                    onPress={() => router.push('/main/admin/lesson/lessons-list')}
                >
                    <Ionicons name="pencil-outline" size={40} color="#f39c12" />
                    <Text style={styles.menuTitle}>Chỉnh Sửa/Xóa Bài</Text>
                    <Text style={styles.menuDesc}>Quản lý bài học hiện có</Text>
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
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginTop: 12,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 4,
    },
    menuSection: {
        marginBottom: 32,
    },
    menuCard: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    addCard: {
        backgroundColor: '#d5f4e6',
    },
    editCard: {
        backgroundColor: '#fef5e7',
    },
    viewCard: {
        backgroundColor: '#ebf5fb',
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2c3e50',
        marginTop: 12,
    },
    menuDesc: {
        fontSize: 12,
        color: '#7f8c8d',
        marginTop: 4,
    },
    statsSection: {
        marginTop: 16,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 12,
    },
    statCard: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#2980b9',
    },
    statLabel: {
        fontSize: 12,
        color: '#7f8c8d',
        fontWeight: '600',
    },
    statValue: {
        fontSize: 14,
        color: '#2c3e50',
        fontWeight: '500',
        marginTop: 4,
    },
});

export default AdminDashboard;
