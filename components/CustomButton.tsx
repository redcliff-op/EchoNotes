import { Pressable } from 'react-native'
import React from 'react'
import {Text, View } from './Themed';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
}

export default function CustomButton({ title, onPress }: CustomButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      >
      <View className='justify-center rounded-full items-center bg-sky-300 p-2'>
        <Text className='text-lg text-black'>{title}</Text>
      </View>
    </Pressable>
  )
}