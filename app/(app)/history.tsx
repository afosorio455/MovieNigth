import { FlatList, Text, View } from 'react-native';

const HISTORY = [
  { id: '1', date: '25 Mar, 2026', winner: 'Dune: Part Two', totalVotes: 9, likes: 7 },
  { id: '2', date: '18 Mar, 2026', winner: 'The Matrix', totalVotes: 12, likes: 10 },
  { id: '3', date: '11 Mar, 2026', winner: 'Interstellar', totalVotes: 8, likes: 6 },
  { id: '4', date: '04 Mar, 2026', winner: 'Se7en', totalVotes: 11, likes: 9 },
  { id: '5', date: '25 Feb, 2026', winner: 'Oppenheimer', totalVotes: 14, likes: 11 },
];

const MEDALS = ['🥇', '🥈', '🥉'];

export default function HistoryScreen() {
  const totalVotes = HISTORY.reduce((a, b) => a + b.totalVotes, 0);
  const avgApproval = Math.round(
    HISTORY.reduce((a, b) => a + (b.likes / b.totalVotes) * 100, 0) / HISTORY.length
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <FlatList
        data={HISTORY}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={{ paddingTop: 64, paddingBottom: 24 }}>
              <Text style={{ color: '#6B7280', fontSize: 14 }}>Noches pasadas</Text>
              <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 'bold', marginTop: 4 }}>
                Historial 📜
              </Text>
            </View>

            {/* Stats summary */}
            <View style={{
              flexDirection: 'row',
              backgroundColor: '#161616',
              borderRadius: 18,
              padding: 18,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: '#2D2D2D',
            }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' }}>{HISTORY.length}</Text>
                <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 3 }}>Noches</Text>
              </View>
              <View style={{ width: 1, backgroundColor: '#2D2D2D' }} />
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' }}>{totalVotes}</Text>
                <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 3 }}>Votos</Text>
              </View>
              <View style={{ width: 1, backgroundColor: '#2D2D2D' }} />
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#6366F1', fontSize: 22, fontWeight: 'bold' }}>{avgApproval}%</Text>
                <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 3 }}>Aprobación</Text>
              </View>
            </View>

            <Text style={{ color: '#4B5563', fontSize: 11, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>
              Últimas sesiones
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item, index }) => {
          const approvalPercent = Math.round((item.likes / item.totalVotes) * 100);
          return (
            <View style={{
              backgroundColor: '#161616',
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor: '#2D2D2D',
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 24, marginRight: 12 }}>
                  {MEDALS[index] ?? '🎬'}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 }}>
                    {item.winner}
                  </Text>
                  <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 3 }}>{item.date}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: '#22C55E', fontWeight: '700', fontSize: 15 }}>
                    {approvalPercent}%
                  </Text>
                  <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>
                    {item.totalVotes} votos
                  </Text>
                </View>
              </View>

              {/* Approval bar */}
              <View style={{ height: 4, backgroundColor: '#2D2D2D', borderRadius: 2, overflow: 'hidden' }}>
                <View style={{
                  height: 4,
                  width: `${approvalPercent}%`,
                  backgroundColor: '#6366F1',
                  borderRadius: 2,
                }} />
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>📭</Text>
            <Text style={{ color: '#6B7280', fontSize: 16 }}>Aún no hay historial</Text>
          </View>
        }
      />
    </View>
  );
}
