import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { useAuthStore } from '../store/authStore'

interface Bet {
  id: string
  event: string
  selection: string
  odds: number
  wagerAmount: number
  status: string
  createdAt: string
}

export default function DashboardScreen({ navigation }: any) {
  const { token } = useAuthStore()
  const [bets, setBets] = useState<Bet[]>([])
  const [stats, setStats] = useState({
    totalBets: 0,
    wins: 0,
    losses: 0,
    totalWagered: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('https://betting-tracker.example.com/api/bets', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setBets(data)

      const wins = data.filter((b: Bet) => b.status === 'won').length
      const losses = data.filter((b: Bet) => b.status === 'lost').length
      const wagered = data.reduce((sum: number, b: Bet) => sum + b.wagerAmount, 0)

      setStats({
        totalBets: data.length,
        wins,
        losses,
        totalWagered: wagered,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Bets</Text>
          <Text style={styles.statValue}>{stats.totalBets}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Wins</Text>
          <Text style={[styles.statValue, { color: '#10b981' }]}>{stats.wins}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Losses</Text>
          <Text style={[styles.statValue, { color: '#ef4444' }]}>{stats.losses}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Wagered</Text>
          <Text style={styles.statValue}>${stats.totalWagered.toFixed(2)}</Text>
        </View>
      </View>

      {/* Recent Bets */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Bets</Text>
        <FlatList
          scrollEnabled={false}
          data={bets.slice(0, 5)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.betCard}>
              <View style={styles.betInfo}>
                <Text style={styles.betEvent}>{item.event}</Text>
                <Text style={styles.betSelection}>{item.selection} @ {item.odds}</Text>
              </View>
              <View>
                <Text style={styles.betWager}>${item.wagerAmount}</Text>
                <Text style={[
                  styles.betStatus,
                  item.status === 'won' ? styles.statusWon : item.status === 'lost' ? styles.statusLost : styles.statusPending
                ]}>
                  {item.status}
                </Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('PlaceBet')}
        >
          <Text style={styles.actionButtonText}>Place Bet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('LiveOdds')}
        >
          <Text style={styles.actionButtonText}>View Odds</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 20,
    backgroundColor: '#2563eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: '50%',
    padding: 10,
  },
  statCardInner: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  betCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  betInfo: {
    flex: 1,
  },
  betEvent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  betSelection: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  betWager: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  betStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  statusWon: {
    color: '#10b981',
  },
  statusLost: {
    color: '#ef4444',
  },
  statusPending: {
    color: '#f59e0b',
  },
  actions: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
})
