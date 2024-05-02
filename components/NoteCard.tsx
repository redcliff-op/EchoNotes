import React from 'react'
import { Text, View } from './Themed'
import { EvilIcons, Ionicons } from '@expo/vector-icons'
import { Alert, Pressable } from 'react-native'
import { useNoteProvider } from '@/Providers/NoteProvider'
import { router } from 'expo-router'

interface NoteCardProps {
  id: number,
  title: string,
  body: string,
  time: number,
  isSaved: number
}

export const NoteCard = ({ id, title, body, time, isSaved }: NoteCardProps) => {

  const { deleteNote, setIsEditing, handleSaveNote } = useNoteProvider()

  const formatDateAndTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}  -  ${hours}:${minutes}`;
  };

  return (
    <View className='border-2 border-sky-300 rounded-3xl p-3 my-2'>
      <Text className='text-2xl font-bold mb-3'>{title}</Text>
      <Text className="text-lg leading-5 text-gray-400">{body}</Text>
      <View className='flex-row items-center justify-between'>
        <Text className='text-sky-300'>{formatDateAndTime(time)}</Text>
        <View className='flex-row items-center'>
          <Pressable
            className='mx-1'
            onPress={() => {
              Alert.alert("Delete Note?", "This cannot be reversed", [
                {
                  text: 'Cancel',
                  style: 'cancel'
                },
                {
                  text: 'Delete',
                  onPress: () => deleteNote(id)
                }
              ])
            }}>
            <Ionicons name='trash' size={25} color={'skyblue'} />
          </Pressable>
          <Pressable
            className='mx-1'
            onPress={() => {
              setIsEditing(true)
              router.navigate({
                pathname: '/NewNote',
                params: {
                  id: id,
                  title: title,
                  body: body
                }
              })
            }}>
            <Ionicons name='create-outline' size={25} color={'skyblue'} />
          </Pressable>
          <Pressable
            className='mx-1'
            onPress={() => {
              handleSaveNote(id, isSaved)
            }}>
            <Ionicons name={(isSaved === 0) ? 'heart-outline' : 'heart'} size={25} color={'skyblue'} />
          </Pressable>
        </View>
      </View>
    </View>
  )
}