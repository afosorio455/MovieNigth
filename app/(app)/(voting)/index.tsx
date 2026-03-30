import { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

const MOCK_MOVIES = [
  { id: '1', title: 'Interstellar', year: 2014, addedBy: 'Andrés', addedByColor: '#6366F1', likes: 3, dislikes: 1 },
  { id: '2', title: 'Dune: Part Two', year: 2024, addedBy: 'María', addedByColor: '#EC4899', likes: 2, dislikes: 0 },
  { id: '3', title: 'The Dark Knight', year: 2008, addedBy: 'Juan', addedByColor: '#F59E0B', likes: 4, dislikes: 1 },
  { id: '4', title: 'Inception', year: 2010, addedBy: 'Laura', addedByColor: '#10B981', likes: 1, dislikes: 2 },
];

type VoteMap = { [id: string]: 'like' | 'dislike' | null };
type CountMap = { [id: string]: { likes: number; dislikes: number } };

export default function VotingScreen() {
  const router = useRouter();

  const [votes, setVotes] = useState<VoteMap>({});
  const [counts, setCounts] = useState<CountMap>(
    MOCK_MOVIES.reduce(
      (acc, m) => ({ ...acc, [m.id]: { likes: m.likes, dislikes: m.dislikes } }),
      {}
    )
  );

  const handleVote = (movieId: string, type: 'like' | 'dislike') => {
    const current = votes[movieId];
    const prev = counts[movieId];
    const next = { ...prev };
    let newVote: 'like' | 'dislike' | null = type;

    if (current === type) {
      // toggle off
      if (type === 'like') next.likes = Math.max(0, prev.likes - 1);
      else next.dislikes = Math.max(0, prev.dislikes - 1);
      newVote = null;
    } else {
      // remove previous vote
      if (current === 'like') next.likes = Math.max(0, prev.likes - 1);
      if (current === 'dislike') next.dislikes = Math.max(0, prev.dislikes - 1);
      // add new vote
      if (type === 'like') next.likes = next.likes + 1;
      else next.dislikes = next.dislikes + 1;
    }

    setVotes((v) => ({ ...v, [movieId]: newVote }));
    setCounts((c) => ({ ...c, [movieId]: next }));
  };

  const totalVoted = Object.values(votes).filter(Boolean).length;

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
            Votaste {totalVoted} de {MOCK_MOVIES.length}
          </Text>
        )}
      </View>

      {/* Movie list */}
      <FlatList
        data={MOCK_MOVIES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 14, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const myVote = votes[item.id];
          const count = counts[item.id];
          const total = count.likes + count.dislikes;
          const likePercent = total > 0 ? (count.likes / total) * 100 : 0;

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
                  <Text style={{ color: '#6B7280', fontSize: 13, marginTop: 3 }}>{item.year}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                    <View style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: item.addedByColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 5,
                    }}>
                      <Text style={{ color: '#FFF', fontSize: 8, fontWeight: 'bold' }}>{item.addedBy[0]}</Text>
                    </View>
                    <Text style={{ color: '#6B7280', fontSize: 12 }}>por {item.addedBy}</Text>
                  </View>
                </View>
                {myVote && (
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
                )}
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
                  onPress={() => handleVote(item.id, 'like')}
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
                    {count.likes}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleVote(item.id, 'dislike')}
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
                    {count.dislikes}
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
