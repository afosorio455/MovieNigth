import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getMovies, getWinner } from '../../../src/database';
import type { MovieWithVotes } from '../../../src/types';

type MovieRow = Omit<MovieWithVotes, 'userVote'>;

const MEDALS = ['🥈', '🥉', '4️⃣', '5️⃣', '6️⃣'];

export default function WinnerScreen() {
  const router = useRouter();
  const [winner, setWinner] = useState<MovieRow | null>(null);
  const [ranking, setRanking] = useState<MovieRow[]>([]);

  useEffect(() => {
    async function load() {
      const [winnerRow, allMovies] = await Promise.all([getWinner(), getMovies()]);
      setWinner(winnerRow);
      // El ranking es todas las películas ordenadas por likes desc, excluyendo al ganador
      const sorted = [...allMovies].sort((a, b) => b.likes - a.likes || a.created_at - b.created_at);
      setRanking(winnerRow ? sorted.filter((m) => m.id !== winnerRow.id) : sorted);
    }
    load();
  }, []);

  if (!winner) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A0A0A', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#6B7280', fontSize: 16 }}>Aún no hay películas con votos</Text>
      </View>
    );
  }

  const totalWinnerVotes = winner.likes + winner.dislikes;
  const approvalPercent = totalWinnerVotes > 0
    ? Math.round((winner.likes / totalWinnerVotes) * 100)
    : 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      {/* Handle bar */}
      <View style={{ alignItems: 'center', paddingTop: 14, paddingBottom: 4 }}>
        <View style={{ width: 40, height: 4, backgroundColor: '#2D2D2D', borderRadius: 2 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 48 }}
      >
        {/* Section label */}
        <Text style={{ color: '#4B5563', fontSize: 11, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', textAlign: 'center', marginBottom: 20 }}>
          Ganadora de la noche
        </Text>

        {/* Winner card */}
        <View style={{
          backgroundColor: '#161616',
          borderRadius: 24,
          padding: 28,
          alignItems: 'center',
          marginBottom: 32,
          borderWidth: 1.5,
          borderColor: '#6366F1',
          shadowColor: '#6366F1',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 12,
        }}>
          <Text style={{ fontSize: 52, marginBottom: 16 }}>🏆</Text>

          {/* Poster */}
          <View style={{
            width: 80,
            height: 100,
            borderRadius: 14,
            backgroundColor: '#2D2D2D',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18,
          }}>
            <Text style={{ fontSize: 34 }}>🎬</Text>
          </View>

          <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}>
            {winner.title}
          </Text>
          {winner.year ? (
            <Text style={{ color: '#6B7280', fontSize: 15, marginTop: 4 }}>{winner.year}</Text>
          ) : null}

          {/* Vote counts */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 24 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#22C55E', fontSize: 24, fontWeight: 'bold' }}>
                👍 {winner.likes}
              </Text>
              <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 3 }}>Me gusta</Text>
            </View>
            <View style={{ width: 1, height: 32, backgroundColor: '#2D2D2D' }} />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#EF4444', fontSize: 24, fontWeight: 'bold' }}>
                👎 {winner.dislikes}
              </Text>
              <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 3 }}>No me gusta</Text>
            </View>
          </View>

          {/* Approval bar */}
          {totalWinnerVotes > 0 && (
            <View style={{ width: '100%', marginTop: 20 }}>
              <View style={{ height: 6, backgroundColor: '#2D2D2D', borderRadius: 3, overflow: 'hidden' }}>
                <View style={{
                  height: 6,
                  width: `${approvalPercent}%`,
                  backgroundColor: '#22C55E',
                  borderRadius: 3,
                }} />
              </View>
              <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 6, textAlign: 'right' }}>
                {approvalPercent}% aprobación
              </Text>
            </View>
          )}
        </View>

        {/* Ranking */}
        {ranking.length > 0 && (
          <>
            <Text style={{ color: '#4B5563', fontSize: 11, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>
              Clasificación
            </Text>
            <View style={{ gap: 10, marginBottom: 32 }}>
              {ranking.map((movie, index) => (
                <View
                  key={movie.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#161616',
                    borderRadius: 14,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: '#2D2D2D',
                  }}
                >
                  <Text style={{ fontSize: 22, marginRight: 12, width: 32 }}>
                    {MEDALS[index] ?? '▪️'}
                  </Text>
                  <View style={{
                    width: 40,
                    height: 50,
                    borderRadius: 8,
                    backgroundColor: '#242424',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Text style={{ fontSize: 18 }}>🎬</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 14 }}>{movie.title}</Text>
                    {movie.year ? (
                      <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>{movie.year}</Text>
                    ) : null}
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: '#22C55E', fontSize: 13, fontWeight: '600' }}>
                      👍 {movie.likes}
                    </Text>
                    <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 2 }}>
                      👎 {movie.dislikes}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Action buttons */}
        <View style={{ gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.replace('/(app)/(home)')}
            style={{
              backgroundColor: '#6366F1',
              paddingVertical: 16,
              borderRadius: 14,
              alignItems: 'center',
              shadowColor: '#6366F1',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>
              🔄  Nueva Votación
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            style={{ paddingVertical: 14, alignItems: 'center' }}
          >
            <Text style={{ color: '#4B5563', fontSize: 15 }}>Volver a la votación</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
