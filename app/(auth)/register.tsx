import { useAuth } from '@/src/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const AVATAR_COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const [error, setError] = useState('');

  const { register, isLoading } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) return;
    setError('');
    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        avatarColor: selectedColor,
      });
      // AuthGuard redirige automáticamente
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la cuenta');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#0A0A0A' }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 32, paddingVertical: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Text style={{ fontSize: 56, marginBottom: 12 }}>🎬</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', letterSpacing: -0.5 }}>
            Crea tu cuenta
          </Text>
          <Text style={{ color: '#6B7280', fontSize: 15, marginTop: 6 }}>
            Únete a la sala de votación
          </Text>
        </View>

        {/* Name */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: '#6B7280', fontSize: 11, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
            Tu nombre
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="¿Cómo te llaman?"
            placeholderTextColor="#4B5563"
            returnKeyType="next"
            style={{
              backgroundColor: '#1E1E1E',
              color: '#FFFFFF',
              fontSize: 16,
              paddingHorizontal: 18,
              paddingVertical: 16,
              borderRadius: 16,
              borderWidth: 1.5,
              borderColor: name ? '#6366F1' : '#2D2D2D',
            }}
          />
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
            placeholder="Mínimo 8 caracteres"
            placeholderTextColor="#4B5563"
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleRegister}
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

        {/* Color picker */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: '#6B7280', fontSize: 11, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
            Tu color
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {AVATAR_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => setSelectedColor(color)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: color,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: selectedColor === color ? 3 : 0,
                  borderColor: '#FFFFFF',
                }}
              >
                {selectedColor === color && (
                  <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Avatar preview */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: selectedColor,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: selectedColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 8,
          }}>
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' }}>
              {name.trim() ? name.trim()[0].toUpperCase() : '?'}
            </Text>
          </View>
        </View>

        {/* Error */}
        {error ? (
          <Text style={{ color: '#EF4444', fontSize: 14, textAlign: 'center', marginBottom: 16 }}>
            {error}
          </Text>
        ) : null}

        {/* CTA */}
        <TouchableOpacity
          onPress={handleRegister}
          disabled={!name.trim() || !email.trim() || !password || isLoading}
          style={{
            backgroundColor: '#6366F1',
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: 'center',
            opacity: name.trim() && email.trim() && password && !isLoading ? 1 : 0.4,
            shadowColor: '#6366F1',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.45,
            shadowRadius: 14,
            elevation: 8,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta →'}
          </Text>
        </TouchableOpacity>

        {/* Login link */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 24, alignItems: 'center' }}
        >
          <Text style={{ color: '#6B7280', fontSize: 14 }}>
            ¿Ya tienes cuenta?{' '}
            <Text style={{ color: '#6366F1', fontWeight: '600' }}>Inicia sesión</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
