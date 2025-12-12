// app/index.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Phần Logo / Ảnh minh họa */}
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/201/201614.png' }} 
          style={styles.logo} 
        />
        <Text style={styles.title}>English Master</Text>
        <Text style={styles.subtitle}>Học tiếng Anh qua bài đọc & từ vựng</Text>
      </View>

      {/* Phần Nút bấm */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryBtn]} 
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.primaryText}>Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryBtn]}
          onPress={() => router.push('/auth/register')}
        >
          <Text style={styles.secondaryText}>Tạo tài khoản mới</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { flex: 2, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#2c3e50' },
  subtitle: { fontSize: 16, color: '#7f8c8d', marginTop: 10, textAlign: 'center' },
  footer: { flex: 1, justifyContent: 'center', width: '100%' },
  button: { height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  primaryBtn: { backgroundColor: '#3498db', elevation: 2 },
  secondaryBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#3498db' },
  primaryText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  secondaryText: { color: '#3498db', fontSize: 18, fontWeight: 'bold' },
});