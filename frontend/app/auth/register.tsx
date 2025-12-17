// app/auth/register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';

export default function RegisterScreen() {
  const { signUp, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateFullName = (name: string): string => {
    if (!name.trim()) return 'Vui lòng nhập họ và tên';
    if (name.trim().length < 2) return 'Họ và tên phải có ít nhất 2 ký tự';
    if (name.trim().length > 50) return 'Họ và tên không được vượt quá 50 ký tự';
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(name.trim())) return 'Họ và tên chỉ được chứa chữ cái';
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Vui lòng nhập email';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return 'Email không đúng định dạng';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Vui lòng nhập mật khẩu';
    if (password.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
    if (!/(?=.*[a-z])/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ thường';
    if (!/(?=.*[A-Z])/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ hoa';
    if (!/(?=.*\d)/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ số';
    if (!/(?=.*[@$!%*?&#])/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (@$!%*?&#)';
    return '';
  };

  const validateConfirmPassword = (confirm: string, original: string): string => {
    if (!confirm) return 'Vui lòng xác nhận mật khẩu';
    if (confirm !== original) return 'Mật khẩu xác nhận không khớp';
    return '';
  };

  const handleRegister = async () => {
    // Validate tất cả các trường
    const newErrors = {
      fullName: validateFullName(fullName),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password)
    };

    setErrors(newErrors);

    // Nếu có lỗi, không tiếp tục
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    const ok = await signUp(fullName.trim(), email.trim(), password);

    if (ok) {
      console.log("Đăng ký thành công");
    } else {
      alert("Đăng ký thất bại");
    }
  };

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
        <View>
          <View style={[styles.inputContainer, errors.fullName && styles.inputError]}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder="Họ và tên"
              style={styles.input}
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                setErrors(prev => ({ ...prev, fullName: '' }));
              }}
            />
          </View>
          {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
        </View>

        <View>
          <View style={[styles.inputContainer, errors.email && styles.inputError]}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder="Email"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors(prev => ({ ...prev, email: '' }));
              }}
            />
          </View>
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        <View>
          <View style={[styles.inputContainer, errors.password && styles.inputError]}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder="Mật khẩu (min 8 ký tự, chữ hoa, số, ký tự đặc biệt)"
              style={styles.input}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors(prev => ({ ...prev, password: '' }));
              }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
            </TouchableOpacity>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </View>

        <View>
          <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder="Xác nhận mật khẩu"
              style={styles.input}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
              }}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
        </View>

        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={isLoading}>
          <Text style={styles.btnText}>{isLoading ? "Đang đăng ký..." : "Đăng ký"}</Text>
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
    paddingHorizontal: 16, height: 56, marginBottom: 4, backgroundColor: '#fafafa'
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16 },
  registerBtn: { backgroundColor: '#27ae60', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 4 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  link: { color: '#27ae60', fontWeight: 'bold' }
});
