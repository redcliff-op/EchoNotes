import { User } from "@react-native-google-signin/google-signin/lib/typescript/src/types";
import { PropsWithChildren, createContext, useContext, useState } from "react";

type NoteType = {
  userInfo?: User,
  noteList: Note[],
  setUserInfo: (userData?: User) => void
}

const NoteContext = createContext<NoteType>({
  userInfo: {
    user: {
      id: "",
      name: "",
      email: "",
      photo: "",
      familyName: "",
      givenName: ""
    },
    scopes: [],
    idToken: "",
    serverAuthCode: ""
  },
  noteList: [],
  setUserInfo: (userData?: User) => { }
})

const NoteProvider = ({ children }: PropsWithChildren) => {
  const [noteList, setNoteList] = useState<Note[]>([])
  const [userInfo, setUserInfo] = useState<User>()

  return (
    <NoteContext.Provider value={{ userInfo, noteList, setUserInfo }}>
      {children}
    </NoteContext.Provider>
  )
}

export default NoteProvider;
export const useNoteProvider = () => useContext(NoteContext);