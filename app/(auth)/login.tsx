import { useAuth } from '@/src/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password) return;
    setError('');
    try {
      await login({ email: email.trim().toLowerCase(), password });
      // AuthGuard en _layout.tsx redirige automáticamente
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#0A0A0A' }}
    >
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 32 }}>
        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: 52 }}>
          <Text style={{ fontSize: 72, marginBottom: 16 }}>🍿</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 'bold', letterSpacing: -0.5 }}>
            MovieNight
          </Text>
          <Text style={{ color: '#6B7280', fontSize: 16, marginTop: 8 }}>
            Vota. Decide. Disfruta.
          </Text>
        </View>

        {/* Email */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: '#6B7280', fontSize: 11, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="tu@email.com"
            placeholderTextColor="#4B5563"
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            style={{
              backgroundColor: '#1E1E1E',
              color: '#FFFFFF',
              fontSize: 16,
              paddingHorizontal: 18,
              paddingVertical: 16,
              borderRadius: 16,
              borderWidth: 1.5,
              borderColor: email ? '#6366F1' : '#2D2D2D',
            }}
          />
        </View>

        {/* Password */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: '#6B7280', fontSize: 11, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
            Contraseña
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#4B5563"
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            style={{
              backgroundColor: '#1E1E1E',
              color: '#FFFFFF',
              fontSize: 16,
              paddingHorizontal: 18,
              paddingVertical: 16,
              borderRadius: 16,
              borderWidth: 1.5,
              borderColor: password ? '#6366F1' : '#2D2D2D',
            }}
          />
        </View>

        {/* Error */}
        {error ? (
          <Text style={{ color: '#EF4444', fontSize: 14, textAlign: 'center', marginBottom: 16 }}>
            {error}
          </Text>
        ) : null}

        {/* CTA */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={!email.trim() || !password || isLoading}
          style={{
            backgroundColor: '#6366F1',
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: 'center',
            opacity: email.trim() && password && !isLoading ? 1 : 0.4,
            shadowColor: '#6366F1',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.45,
            shadowRadius: 14,
            elevation: 8,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
            {isLoading ? 'Entrando...' : 'Entrar a la sala →'}
          </Text>
        </TouchableOpacity>

        {/* Register link */}
        <TouchableOpacity
          onPress={() => router.push('/(auth)/register')}
          style={{ marginTop: 24, alignItems: 'center' }}
        >
          <Text style={{ color: '#6B7280', fontSize: 14 }}>
            ¿Sin cuenta?{' '}
            <Text style={{ color: '#6366F1', fontWeight: '600' }}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
