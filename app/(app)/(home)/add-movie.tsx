import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function AddMovieScreen() {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const router = useRouter();

  const handleAdd = () => {
    if (!title.trim()) return;
    // TODO: persist to database
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#0A0A0A' }}
    >
      {/* Handle bar */}
      <View style={{ alignItems: 'center', paddingTop: 14, paddingBottom: 8 }}>
        <View style={{ width: 40, height: 4, backgroundColor: '#2D2D2D', borderRadius: 2 }} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 20 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' }}>
            🎬  Agregar Película
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: '#1E1E1E',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#2D2D2D',
            }}
          >
            <Text style={{ color: '#9CA3AF', fontSize: 14 }}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Title input */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: '#6B7280', fontSize: 11, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
            Título de la película
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ej: Interstellar"
            placeholderTextColor="#4B5563"
            autoFocus
            style={{
              backgroundColor: '#1E1E1E',
              color: '#FFFFFF',
              fontSize: 16,
              paddingHorizontal: 18,
              paddingVertical: 15,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: title ? '#6366F1' : '#2D2D2D',
            }}
          />
        </View>

        {/* Year input */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: '#6B7280', fontSize: 11, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
            Año (opcional)
          </Text>
          <TextInput
            value={year}
            onChangeText={setYear}
            placeholder="Ej: 2014"
            placeholderTextColor="#4B5563"
            keyboardType="number-pad"
            maxLength={4}
            style={{
              backgroundColor: '#1E1E1E',
              color: '#FFFFFF',
              fontSize: 16,
              paddingHorizontal: 18,
              paddingVertical: 15,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: year ? '#6366F1' : '#2D2D2D',
            }}
          />
        </View>

        {/* Preview card */}
        {title.trim() ? (
          <View style={{
            backgroundColor: '#161616',
            borderRadius: 16,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 32,
            borderWidth: 1,
            borderColor: '#6366F130',
          }}>
            <View style={{
              width: 48,
              height: 60,
              borderRadius: 10,
              backgroundColor: '#242424',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 14,
            }}>
              <Text style={{ fontSize: 22 }}>🎬</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 }}>{title}</Text>
              {year ? (
                <Text style={{ color: '#6B7280', fontSize: 13, marginTop: 3 }}>{year}</Text>
              ) : null}
              <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 6 }}>Agregada por ti</Text>
            </View>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#6366F1' }} />
          </View>
        ) : null}

        {/* Buttons */}
        <View style={{ gap: 10 }}>
          <TouchableOpacity
            onPress={handleAdd}
            disabled={!title.trim()}
            style={{
              backgroundColor: '#6366F1',
              paddingVertical: 16,
              borderRadius: 14,
              alignItems: 'center',
              opacity: title.trim() ? 1 : 0.4,
              shadowColor: '#6366F1',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
              Agregar película
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            style={{ paddingVertical: 14, alignItems: 'center' }}
          >
            <Text style={{ color: '#4B5563', fontSize: 15 }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
