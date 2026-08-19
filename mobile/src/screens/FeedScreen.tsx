import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Social Feed Screen</Text>
      <Text style={styles.placeholder}>Coming soon - See posts from users you follow</Text>
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
