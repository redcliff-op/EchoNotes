import { StatusBar } from "expo-status-bar";
import { Button } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";
import { View, Text } from "@/components/Themed";
import { Redirect } from "expo-router";
import { useNoteProvider } from "@/Providers/NoteProvider";

export default function App() {
  const { userInfo } = useNoteProvider();
  const { setUserInfo } = useNoteProvider();
  const [error, setError] = useState();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "967229956856-m2984gvfptui8kh4as636bnq2785nmp0.apps.googleusercontent.com",
    });
  }, []);

  const signin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      setUserInfo(await GoogleSignin.signIn())
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