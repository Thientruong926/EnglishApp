// app/auth/register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Tạo tài khoản</Text>
        <Text style={styles.subtitle}>Bắt đầu hành trình học tiếng Anh</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
          <TextInput placeholder="Họ và tên" style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
          <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
          <TextInput placeholder="Mật khẩu" style={styles.input} secureTextEntry />
        </View>

        <TouchableOpacity style={styles.registerBtn} onPress={() => alert('Xử lý đăng ký sau!')}>
          <Text style={styles.btnText}>Đăng Ký</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text>Đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.link}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  backButton: { marginTop: 20, marginBottom: 20 },
  headerContainer: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#888', marginTop: 8 },
  form: { flex: 1 },
  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', 
    borderWidth: 1, borderColor: '#eee', borderRadius: 12, 
    paddingHorizontal: 16, height: 56, marginBottom: 16, backgroundColor: '#fafafa' 
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16 },
  registerBtn: { backgroundColor: '#27ae60', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 4 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  link: { color: '#27ae60', fontWeight: 'bold' }
});