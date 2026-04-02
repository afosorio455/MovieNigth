import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../src/hooks/useAuth';

const MENU_ITEMS = [
  { icon: '✏️', label: 'Editar nombre' },
  { icon: '🎨', label: 'Cambiar color de avatar' },
  { icon: '🔔', label: 'Notificaciones' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        {/* Top color band */}
        <View style={{ height: 150, backgroundColor: user?.avatarColor ?? '#6366F1', paddingTop: 64, paddingHorizontal: 20 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' }}>Perfil</Text>
        </View>

        {/* Avatar overlapping band */}
        <View style={{ alignItems: 'center', marginTop: -44, marginBottom: 16 }}>
          <View style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: user?.avatarColor ?? '#6366F1',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 4,
            borderColor: '#0A0A0A',
            shadowColor: user?.avatarColor ?? '#6366F1',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
          }}>
            <Text style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 'bold' }}>
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>

          <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginTop: 12 }}>
            {user?.name ?? ''}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#22C55E', marginRight: 6 }} />
            <Text style={{ color: '#22C55E', fontSize: 13 }}>En línea</Text>
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
          onPress={handleLogout}
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
