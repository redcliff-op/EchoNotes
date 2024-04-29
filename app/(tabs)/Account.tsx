import { Image, StyleSheet } from 'react-native'
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
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', marginVertical: 10 }}>
        <Image
          style={styles.userImage}
          source={{ uri: userInfo?.user.photo || "" }}
        />
        <View style={{ justifyContent: 'center', paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            {userInfo?.user.name}
          </Text>
          <Text style={{ color: 'gray' }}>
            Your Name
          </Text>
        </View>
      </View>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'skyblue' }}>
        Email
      </Text>
      <Text style={{ fontSize: 16 }}>{userInfo?.user.email}</Text>
      <CustomButton title='Logout' onPress={logout} ></CustomButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'flex-start',
    padding: 10
  },
  userImage: {
    height: 50,
    width: 50,
    borderRadius: 50
  }
})