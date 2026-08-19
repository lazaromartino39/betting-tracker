import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function PlaceBetScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Place Bet Screen</Text>
      <Text style={styles.placeholder}>Coming soon - Bet placement form with live odds</Text>
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
