import { StyleSheet } from 'react-native'
import React from 'react'
import {Text, View } from '@/components/Themed'

export default function Notes() {
  return (
    <View style={styles.container}>
      <Text>Notes</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignContent:'center'
  }
})