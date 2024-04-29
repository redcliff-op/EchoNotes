import { Image } from 'react-native'
import React from 'react'
import { View, Text } from '@/components/Themed'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { useNoteProvider } from '@/Providers/NoteProvider';
import CustomButton from '@/components/CustomButton';

export default function Settings() {

  const { userInfo, setUserInfo } = useNoteProvider()

  const logout = async () => {
    setUserInfo()
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
    router.navigate("/Login")
  };

  return (
    <View className="flex-1 p-3">
      <View className="flex-row align-middle items-center">
        <Image
          className="w-[50] h-[50] rounded-full bg-gray-200"
          source={{ uri: userInfo?.user.photo || "" }}
        />
        <View className='justify-center p-2'>
          <Text className='text-xl'>
            {userInfo?.user.name}
          </Text>
          <Text className="text-gray-400">
            Your Name
          </Text>
        </View>
      </View>
      <Text className='text-sky-300 text-lg'>
        Email
      </Text>
      <Text className='text-lg mb-2'>{userInfo?.user.email}</Text>
      <CustomButton title='Logout' onPress={logout} ></CustomButton>
    </View>
  )
}