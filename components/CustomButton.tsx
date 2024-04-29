import { Pressable, StyleSheet, View, Text } from 'react-native'
import React from 'react'

interface CustomButtonProps {
  title: string;
  onPress: () => void;
}

export default function CustomButton({ title, onPress }: CustomButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.button}>
      <View style={styles.buttonContent}>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    backgroundColor: 'skyblue',
    alignItems: 'center',
    marginVertical:10
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color:'black',
    fontSize: 16,
  },
})