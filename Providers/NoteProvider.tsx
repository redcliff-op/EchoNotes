import { User } from "@react-native-google-signin/google-signin/lib/typescript/src/types";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import * as SQLite from 'expo-sqlite';

type NoteType = {
  userInfo?: User,
  noteList: Note[],
  isEditing: boolean,
  setIsEditing: (status: boolean) => void,
  setUserInfo: (userData?: User) => void,
  addNote: (title: string, body: string) => void,
  deleteNote: (id: number) => void,
  editNote: (id: number, title: string, body: string) => void
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
  isEditing: false,
  setIsEditing: (status: boolean) => { },
  setUserInfo: (userData?: User) => { },
  addNote: (title: string, body: string) => { },
  deleteNote: (id: number) => { },
  editNote: (id: number, title: string, body: string) => { }
})

const NoteProvider = ({ children }: PropsWithChildren) => {

  const db = SQLite.openDatabase('EchoNotes.db')

  const [noteList, setNoteList] = useState<Note[]>([])
  const [userInfo, setUserInfo] = useState<User>()
  const [isEditing, setIsEditing] = useState<boolean>(false)

  useEffect(() => {
    createTable()
    fetchNotesFromLocal()
  }, []);

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT, time INTEGER, isSaved INTEGER)');
    });
  }

  const fetchNotesFromLocal = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM notes', [],
        (txObj, result) => setNoteList(result.rows._array)
      )
    })
  }

  const addNote = async (title: string, body: string) => {
    const time = new Date().getTime()
    await db.transactionAsync(async (tx) => {
      await tx.executeSqlAsync(
        'INSERT INTO notes (title, body, time, isSaved) VALUES (?, ?, ?, ?)',
        [title, body, time, 0]).then(
          (result) => {
            let existingNotes = [...noteList]
            existingNotes.push({ id: (result.insertId || 0), title: title, body: body, time: time, isSaved: 0 })
            setNoteList(existingNotes)
          }
        );
    });
  };

  const deleteNote = async (id: number) => {
    await db.transactionAsync(async (tx) => {
      await tx.executeSqlAsync('DELETE FROM notes WHERE id = ?', [id]).then(
        (result) => {
          if (result.rowsAffected > 0) {
            setNoteList(noteList.filter((p) => p.id !== id))
          }
        }
      )
    })
  }

  const editNote = async (id: number, title: string, body: string) => {
    await db.transactionAsync(async (tx) => {
      await tx.executeSqlAsync('UPDATE notes SET title =?, body =? WHERE id =?', [title, body, id]).then(
        (result) => {
          console.log('Database update result:', result);
          if (result.rowsAffected > 0) {
            const updatedNotes = [...noteList]
            const index = updatedNotes.findIndex(p=>p.id.toString()===id.toString())
            updatedNotes[index].title = title,
            updatedNotes[index].body = body
            setNoteList(updatedNotes);
          }
        }
      )
    })
  }

  return (
    <NoteContext.Provider value={{ userInfo, noteList, setUserInfo, addNote, deleteNote, editNote, isEditing, setIsEditing }}>
      {children}
    </NoteContext.Provider>
  )
}

export default NoteProvider;
export const useNoteProvider = () => useContext(NoteContext);