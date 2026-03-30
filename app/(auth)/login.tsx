import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

const AVATAR_COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const router = useRouter();

  const handleLogin = () => {
    if (!name.trim()) return;
    router.replace('/(app)/(home)');
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

        {/* Name input */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: '#6B7280', fontSize: 11, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
            Tu nombre
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="¿Cómo te llaman?"
            placeholderTextColor="#4B5563"
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
              borderColor: name ? '#6366F1' : '#2D2D2D',
            }}
          />
        </View>

        {/* Color picker */}
        <View style={{ marginBottom: 32 }}>
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
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: selectedColor,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: selectedColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 12,
            elevation: 8,
          }}>
            <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: 'bold' }}>
              {name.trim() ? name.trim()[0].toUpperCase() : '?'}
            </Text>
          </View>
          {name.trim() ? (
            <Text style={{ color: '#9CA3AF', fontSize: 14, marginTop: 10 }}>{name.trim()}</Text>
          ) : null}
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={!name.trim()}
          style={{
            backgroundColor: '#6366F1',
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: 'center',
            opacity: name.trim() ? 1 : 0.4,
            shadowColor: '#6366F1',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.45,
            shadowRadius: 14,
            elevation: 8,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
            Entrar a la sala →
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
