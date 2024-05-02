import { useNoteProvider } from '@/Providers/NoteProvider'
import { View } from '@/components/Themed'
import { Ionicons } from '@expo/vector-icons'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Pressable, TextInput, useColorScheme } from 'react-native'

type RouterParams ={
  id: string,
  title:string,
  body:string
}

export default function NewNote() {

  const { addNote, isEditing, setIsEditing, editNote } = useNoteProvider()
  const { id, title, body } = useLocalSearchParams<RouterParams & {id:number}>()
  const [newTitle, setNewTitle] = useState((isEditing) ? title.toString() : "")
  const [newBody, setNewBody] = useState((isEditing) ? body.toString() : "")
  const colorScheme = useColorScheme()
  
  const headerTitle = (isEditing) ? 'Edit the Note' : 'Add a New Note'

  useEffect(() => {
    return () => {
      setIsEditing(false)
    }
  }, [setIsEditing])

  return (
    <View className='flex 1 align-center align-middle p-5'>
      <TextInput
        value={newTitle}
        onChangeText={setNewTitle}
        className="border-sky-300 border-2 min-h-[50] rounded-3xl my-2 px-5 py-2"
        multiline={true}
        style={{ color: (colorScheme === 'light') ? 'black' : 'white' }}
        placeholder='Title'
        placeholderTextColor='gray'
      />
      <Stack.Screen options={{ title: 'Add a new note' }} />
      <TextInput
        value={newBody}
        onChangeText={setNewBody}
        className='border-sky-300 border-2 min-h-[50] rounded-3xl my-2 px-5 py-2'
        multiline={true}
        style={{ color: (colorScheme === 'light') ? 'black' : 'white' }}
        placeholder='Body'
        placeholderTextColor='gray'
      />
      <Stack.Screen
        options={{
          title: `${headerTitle}`,
          headerRight: () =>
            (newTitle) ?
              <Pressable
                onPress={() => {
                  (!isEditing) ?
                    addNote(newTitle, newBody)
                    :editNote(id,newTitle, newBody)
                  setNewTitle("")
                  setNewBody("")
                  router.navigate('/(tabs)/Notes')
                }}>
                <Ionicons name='checkmark-done' size={30} color={'white'} />
              </Pressable>
              : null
        }}
      />
    </View>
  )
}
