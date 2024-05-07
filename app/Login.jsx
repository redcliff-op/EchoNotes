import { StatusBar } from "expo-status-bar";
import { Button } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";
import { View, Text } from "@/components/Themed";
import { Redirect } from "expo-router";
import { useNoteProvider } from "@/Providers/NoteProvider";

export default function App() {
  const { userInfo, setUserInfo, syncNotesWithCloud } = useNoteProvider();
  const [error, setError] = useState();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "431484045629-nbadj51cjhecppbsg007civ6qm9k29vl.apps.googleusercontent.com",
    });
  }, []);

  const signin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      setUserInfo(user)
      syncNotesWithCloud(user.user.email)
      setError();
    } catch (e) {
      setError(e);
    }
  };

  return (
    <View className="flex-1 justify-center p-10">
      <Text>{JSON.stringify(error)}</Text>
      {userInfo && <Text>{JSON.stringify(userInfo.user)}</Text>}
      {userInfo ? (
        <Redirect href={'/(tabs)/Notes'}/>
      ) : (
        <Button
          title="Login"
          onPress={signin}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}