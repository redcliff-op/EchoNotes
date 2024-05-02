import React from 'react'
import { View } from '@/components/Themed'
import { FlatList, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useNoteProvider } from '@/Providers/NoteProvider'
import { NoteCard } from '@/components/NoteCard'

export default function Saved() {
  const { noteList } = useNoteProvider()
  return (
    <View className='flex-1 justify-center p-3'>
      <FlatList
        data={noteList}
        renderItem={({ item }) =>
          (item.isSaved === 1) ?
            <NoteCard
              id={item.id}
              title={item.title}
              body={item.body}
              time={item.time}
              isSaved={item.isSaved || 0}
            /> : null
        }
      />
      <TouchableOpacity
        className='absolute self-start right-10 bottom-10'
        onPress={() => {
          router.navigate('/NewNote')
        }}
      >
        <Ionicons
          color='skyblue'
          name='add-circle'
          size={60} />
      </TouchableOpacity>
    </View>
  )
}