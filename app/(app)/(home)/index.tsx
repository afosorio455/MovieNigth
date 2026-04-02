import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useMovies, useUsers } from '../../../src/hooks/hooks';
import { useAuth } from '../../../src/hooks/useAuth';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { movies, refetch: refetchMovies } = useMovies(user?.id ?? '');
  const { users, refetch: refetchUsers } = useUsers();

  // Refresca los datos cada vez que la pantalla toma foco
  // (p.ej. al volver del modal add-movie)
  useFocusEffect(
    useCallback(() => {
      refetchMovies();
      refetchUsers();
    }, [refetchMovies, refetchUsers]),
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 64, paddingBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ color: '#6B7280', fontSize: 14 }}>Buenas noches 👋</Text>
              <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 'bold', marginTop: 4 }}>
                Movie Lobby
              </Text>
            </View>
            {/* Sync indicator */}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#2D2D2D' }}>
              <View style={{ width: 7, height: 7, backgroundColor: '#22C55E', borderRadius: 4, marginRight: 6 }} />
              <Text style={{ color: '#22C55E', fontSize: 12, fontWeight: '600' }}>En línea</Text>
            </View>
          </View>
        </View>

        {/* Connected users */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: '#4B5563', fontSize: 11, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', paddingHorizontal: 20, marginBottom: 14 }}>
            En la sala · {users.length} {users.length === 1 ? 'persona' : 'personas'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 18 }}>
            {users.map((user) => (
              <View key={user.id} style={{ alignItems: 'center' }}>
                <View style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: user.avatar_color,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 6,
                  shadowColor: user.avatar_color,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.4,
                  shadowRadius: 6,
                  elevation: 4,
                }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' }}>
                    {user.name[0]}
                  </Text>
                </View>
                <Text style={{ color: '#9CA3AF', fontSize: 12 }}>{user.name.split(' ')[0]}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 28, backgroundColor: '#161616', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#2D2D2D' }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' }}>{movies.length}</Text>
            <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>Películas</Text>
          </View>
          <View style={{ width: 1, backgroundColor: '#2D2D2D' }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' }}>{users.length}</Text>
            <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>Votantes</Text>
          </View>
          <View style={{ width: 1, backgroundColor: '#2D2D2D' }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: '#6366F1', fontSize: 24, fontWeight: 'bold' }}>~30s</Text>
            <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>Próx. sync</Text>
          </View>
        </View>

        {/* Section header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 14 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>
            Esta noche
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(app)/(home)/add-movie')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#6366F1',
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>+ Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* Movie cards */}
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {movies.map((movie) => {
            const addedByUser = users.find((u) => u.id === movie.created_by_user_id);
            return (
              <View
                key={movie.id}
                style={{
                  backgroundColor: '#161616',
                  borderRadius: 20,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#2D2D2D',
                }}
              >
                {/* Poster placeholder */}
                <View style={{
                  width: 62,
                  height: 80,
                  borderRadius: 12,
                  backgroundColor: '#242424',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}>
                  <Text style={{ fontSize: 26 }}>🎬</Text>
                </View>
                {/* Info */}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16, marginBottom: 3 }}>
                    {movie.title}
                  </Text>
                  {movie.year ? (
                    <Text style={{ color: '#6B7280', fontSize: 13 }}>{movie.year}</Text>
                  ) : null}
                  {addedByUser ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                      <View style={{
                        width: 18,
                        height: 18,
                        borderRadius: 9,
                        backgroundColor: addedByUser.avatar_color,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 6,
                      }}>
                        <Text style={{ color: '#FFF', fontSize: 9, fontWeight: 'bold' }}>
                          {addedByUser.name[0]}
                        </Text>
                      </View>
                      <Text style={{ color: '#6B7280', fontSize: 12 }}>por {addedByUser.name}</Text>
                    </View>
                  ) : null}
                </View>
                {/* Arrow */}
                <Text style={{ color: '#3D3D3D', fontSize: 20 }}>›</Text>
              </View>
            );
          })}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating CTA */}
      <View style={{ position: 'absolute', bottom: 24, left: 20, right: 20 }}>
        <TouchableOpacity
          onPress={() => router.push('/(app)/(voting)')}
          style={{
            backgroundColor: '#6366F1',
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: 'center',
            shadowColor: '#6366F1',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.5,
            shadowRadius: 16,
            elevation: 10,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>
            🗳️  Ir a Votar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
