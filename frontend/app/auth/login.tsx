// app/auth/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Thư viện icon có sẵn trong Expo
import { useAuth } from '@/src/context/AuthContext';
export default function LoginScreen() {
    const [showPass, setShowPass] = useState(false);
    const [email, setEmail] = useState('admin@gmail.com'); 
    const [password, setPassword] = useState('123456');
    // Lấy hàm signIn và biến isLoading từ Context
  const { signIn, isLoading } = useAuth();
  const handleLogin = () => {
    signIn(email, password);
  };
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Chào mừng trở lại!</Text>
        <Text style={styles.subtitle}>Nhập thông tin để tiếp tục</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
          <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
          <TextInput 
            placeholder="Mật khẩu" 
            style={styles.input} 
            secureTextEntry={!showPass} 
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Ionicons name={showPass ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotPass}>
          <Text style={{color: '#3498db'}}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.loginBtn, isLoading && { backgroundColor: '#95a5a6' }]} 
            onPress={handleLogin}
            disabled={isLoading}
            >
            {isLoading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.loginText}>Đăng Nhập</Text>
            )}
            </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text>Chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/register')}>
          <Text style={styles.link}>Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  backButton: { marginTop: 20, marginBottom: 20 },
  headerContainer: { marginBottom: 40 },
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
  forgotPass: { alignSelf: 'flex-end', marginBottom: 24 },
  loginBtn: { backgroundColor: '#3498db', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', shadowColor: '#3498db', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  loginText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  link: { color: '#3498db', fontWeight: 'bold' }
});