import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

const USER = { name: 'Andrés', color: '#6366F1', nights: 12, won: 5, totalVotes: 47 };

const MENU_ITEMS = [
  { icon: '✏️', label: 'Editar nombre' },
  { icon: '🎨', label: 'Cambiar color de avatar' },
  { icon: '🔔', label: 'Notificaciones' },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        {/* Top color band */}
        <View style={{ height: 150, backgroundColor: USER.color + '18', paddingTop: 64, paddingHorizontal: 20 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' }}>Perfil</Text>
        </View>

        {/* Avatar overlapping band */}
        <View style={{ alignItems: 'center', marginTop: -44, marginBottom: 16 }}>
          <View style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: USER.color,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 4,
            borderColor: '#0A0A0A',
            shadowColor: USER.color,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
          }}>
            <Text style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 'bold' }}>
              {USER.name[0]}
            </Text>
          </View>

          <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginTop: 12 }}>
            {USER.name}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#22C55E', marginRight: 6 }} />
            <Text style={{ color: '#22C55E', fontSize: 13 }}>En línea</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={{
          flexDirection: 'row',
          marginHorizontal: 20,
          backgroundColor: '#161616',
          borderRadius: 20,
          padding: 20,
          marginBottom: 28,
          borderWidth: 1,
          borderColor: '#2D2D2D',
        }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 'bold' }}>{USER.nights}</Text>
            <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 3 }}>Noches</Text>
          </View>
          <View style={{ width: 1, backgroundColor: '#2D2D2D' }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: '#6366F1', fontSize: 26, fontWeight: 'bold' }}>{USER.won}</Text>
            <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 3 }}>Ganadas</Text>
          </View>
          <View style={{ width: 1, backgroundColor: '#2D2D2D' }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: '#22C55E', fontSize: 26, fontWeight: 'bold' }}>{USER.totalVotes}</Text>
            <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 3 }}>Votos</Text>
          </View>
        </View>

        {/* Settings section */}
        <Text style={{ color: '#4B5563', fontSize: 11, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginHorizontal: 20, marginBottom: 12 }}>
          Cuenta
        </Text>

        <View style={{
          marginHorizontal: 20,
          backgroundColor: '#161616',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#2D2D2D',
          overflow: 'hidden',
          marginBottom: 28,
        }}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 18,
                paddingVertical: 15,
                borderBottomWidth: i < MENU_ITEMS.length - 1 ? 1 : 0,
                borderBottomColor: '#2D2D2D',
              }}
            >
              <Text style={{ fontSize: 18, marginRight: 14 }}>{item.icon}</Text>
              <Text style={{ color: '#FFFFFF', fontSize: 15, flex: 1 }}>{item.label}</Text>
              <Text style={{ color: '#4B5563', fontSize: 20 }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={() => router.replace('/(auth)/login')}
          style={{
            marginHorizontal: 20,
            backgroundColor: '#1A1A1A',
            borderRadius: 14,
            paddingVertical: 15,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#EF444430',
          }}
        >
          <Text style={{ color: '#EF4444', fontWeight: '600', fontSize: 15 }}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
