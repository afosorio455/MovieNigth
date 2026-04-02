import { useCallback } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useMovies } from '../../../src/hooks/hooks';
import { useAuth } from '../../../src/hooks/useAuth';

export default function VotingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { movies, castVote, refetch } = useMovies(user?.id ?? '');

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const totalVoted = movies.filter((m) => m.userVote !== null).length;

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 64, paddingBottom: 20 }}>
        <Text style={{ color: '#6B7280', fontSize: 14 }}>Elige tu favorita</Text>
        <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 'bold', marginTop: 4 }}>
          Votación 🗳️
        </Text>
        {totalVoted > 0 && (
          <Text style={{ color: '#6366F1', fontSize: 13, marginTop: 6 }}>
            Votaste {totalVoted} de {movies.length}
          </Text>
        )}
      </View>

      {/* Movie list */}
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 14, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const myVote = item.userVote;
          const total = item.likes + item.dislikes;
          const likePercent = total > 0 ? (item.likes / total) * 100 : 0;

          return (
            <View style={{
              backgroundColor: '#161616',
              borderRadius: 20,
              padding: 16,
              borderWidth: 1.5,
              borderColor: myVote ? '#6366F140' : '#2D2D2D',
            }}>
              {/* Movie info row */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                <View style={{
                  width: 56,
                  height: 72,
                  borderRadius: 12,
                  backgroundColor: '#242424',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}>
                  <Text style={{ fontSize: 24 }}>🎬</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
                  {item.year ? (
                    <Text style={{ color: '#6B7280', fontSize: 13, marginTop: 3 }}>{item.year}</Text>
                  ) : null}
                </View>
                {myVote ? (
                  <View style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: myVote === 'like' ? '#16A34A20' : '#DC262620',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 14 }}>{myVote === 'like' ? '👍' : '👎'}</Text>
                  </View>
                ) : null}
              </View>

              {/* Progress bar */}
              {total > 0 && (
                <View style={{ height: 3, backgroundColor: '#2D2D2D', borderRadius: 2, marginBottom: 14, overflow: 'hidden' }}>
                  <View style={{
                    height: 3,
                    width: `${likePercent}%`,
                    backgroundColor: '#22C55E',
                    borderRadius: 2,
                  }} />
                </View>
              )}

              {/* Vote buttons */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  onPress={() => castVote(item.id, 'like')}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: myVote === 'like' ? '#16A34A15' : '#1E1E1E',
                    borderWidth: 1.5,
                    borderColor: myVote === 'like' ? '#22C55E' : '#2D2D2D',
                    gap: 6,
                  }}
                >
                  <Text style={{ fontSize: 18 }}>👍</Text>
                  <Text style={{
                    color: myVote === 'like' ? '#22C55E' : '#9CA3AF',
                    fontWeight: '700',
                    fontSize: 15,
                  }}>
                    {item.likes}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => castVote(item.id, 'dislike')}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: myVote === 'dislike' ? '#DC262615' : '#1E1E1E',
                    borderWidth: 1.5,
                    borderColor: myVote === 'dislike' ? '#EF4444' : '#2D2D2D',
                    gap: 6,
                  }}
                >
                  <Text style={{ fontSize: 18 }}>👎</Text>
                  <Text style={{
                    color: myVote === 'dislike' ? '#EF4444' : '#9CA3AF',
                    fontWeight: '700',
                    fontSize: 15,
                  }}>
                    {item.dislikes}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {/* Floating CTA */}
      <View style={{ position: 'absolute', bottom: 24, left: 20, right: 20 }}>
        <TouchableOpacity
          onPress={() => router.push('/(app)/(voting)/winner')}
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
            🏆  Ver Ganador
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
