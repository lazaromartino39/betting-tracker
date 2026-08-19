import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function LiveOddsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Odds Screen</Text>
      <Text style={styles.placeholder}>Coming soon - Real-time odds from all sportsbooks</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  placeholder: {
    color: '#6b7280',
  },
})
