import { User } from "@react-native-google-signin/google-signin/lib/typescript/src/types";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import * as SQLite from 'expo-sqlite';
import firestore from '@react-native-firebase/firestore';

type NoteType = {
  userInfo?: User,
  noteList: Note[],
  isEditing: boolean,
  setIsEditing: (status: boolean) => void,
  setUserInfo: (userData?: User) => void,
  addNote: (title: string, body: string) => void,
  deleteNote: (id: number) => void,
  editNote: (id: number, title: string, body: string) => void,
  handleSaveNote: (id: number, isSaved: number) => void,
  syncNotesWithCloud: (email: string) => void
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
  editNote: (id: number, title: string, body: string) => { },
  handleSaveNote: (id: number, isSaved: number) => { },
  syncNotesWithCloud: (email: string) => { }
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
            const firestoreRef = firestore().collection('Users').doc(userInfo?.user.email);
            firestoreRef.update({
              'noteList': existingNotes
            });
          }
        );
    });
  };

  const deleteNote = async (id: number) => {
    await db.transactionAsync(async (tx) => {
      await tx.executeSqlAsync('DELETE FROM notes WHERE id = ?', [id]).then(
        (result) => {
          if (result.rowsAffected > 0) {
            let existingNotes = noteList.filter((p) => p.id !== id)
            setNoteList(existingNotes)
            const firestoreRef = firestore().collection('Users').doc(userInfo?.user.email);
            firestoreRef.update({
              'noteList': existingNotes
            });
          }
        }
      )
    })
  }

  const editNote = async (id: number, title: string, body: string) => {
    await db.transactionAsync(async (tx) => {
      await tx.executeSqlAsync('UPDATE notes SET title =?, body =? WHERE id =?', [title, body, id]).then(
        (result) => {
          if (result.rowsAffected > 0) {
            const existingNotes = [...noteList]
            const index = existingNotes.findIndex(p => p.id.toString() === id.toString())
            existingNotes[index].title = title
            existingNotes[index].body = body
            setNoteList(existingNotes);
            const firestoreRef = firestore().collection('Users').doc(userInfo?.user.email);
            firestoreRef.update({
              'noteList': existingNotes
            });
          }
        }
      )
    })
  }

  const handleSaveNote = async (id: number, isSaved: number) => {
    const saved = (isSaved === 0) ? 1 : 0
    await db.transactionAsync(async (tx) => {
      tx.executeSqlAsync('UPDATE notes SET isSaved = ? WHERE id = ?', [saved, id]).then(
        (result) => {
          if (result.rowsAffected > 0) {
            const existingNotes = [...noteList]
            const index = existingNotes.findIndex(p => p.id.toString() === id.toString())
            existingNotes[index].isSaved = saved
            setNoteList(existingNotes)
            const firestoreRef = firestore().collection('Users').doc(userInfo?.user.email);
            firestoreRef.update({
              'noteList': existingNotes
            });
          }
        }
      )
    })
  }

  const syncNotesWithCloud = async (email: string) => {
    const firestoreRef = firestore().collection('Users').doc(email);
    const firestoreSnapshot = await firestoreRef.get();

    if (!firestoreSnapshot.exists) {
      await firestoreRef.set({
        noteList: noteList
      });
      return;
    }

    const cloudData = firestoreSnapshot.data();

    if (!cloudData || !cloudData.noteList) {
      await firestoreRef.set({
        noteList: noteList
      });
      return;
    }

    const cloudNoteList = cloudData.noteList as Note[];
    if (cloudNoteList.length === 0) {
      await firestoreRef.set({
        noteList: noteList
      });
      return;
    }

    const latestLocalNote = noteList[noteList.length - 1];
    const latestCloudNote = cloudNoteList[cloudNoteList.length - 1];

    if (noteList.length === 0 || (latestLocalNote.time < latestCloudNote.time)) {
      setNoteList(cloudNoteList);
      console.log('asa')
      await db.transactionAsync(async (tx) => {
        await tx.executeSqlAsync('DELETE FROM notes');
        for (const note of cloudNoteList) {
          await tx.executeSqlAsync(
            'INSERT INTO notes (title, body, time, isSaved) VALUES (?, ?, ?, ?)',
            [note.title, note.body, note.time, note.isSaved]
          );
        }
      });
      fetchNotesFromLocal();
    } else if (latestLocalNote.time > latestCloudNote.time) {
      await firestoreRef.set({
        noteList: noteList
      });
    }
  };


  return (
    <NoteContext.Provider value={{ userInfo, noteList, setUserInfo, addNote, deleteNote, editNote, isEditing, setIsEditing, handleSaveNote, syncNotesWithCloud }}>
      {children}
    </NoteContext.Provider>
  )
}

export default NoteProvider;
export const useNoteProvider = () => useContext(NoteContext);