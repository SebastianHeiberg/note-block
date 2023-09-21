import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import { app, database } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { NavigationContainer } from "@react-navigation/native"; // npm install @react-navigation/native
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // npm install @react-navigation/native-stack
import { useCollection, useCollections } from "react-firebase-hooks/firestore";
import * as ImagePicker from 'expo-image-picker'
import { storage } from './firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Notes">
        <Stack.Screen name="Notes" component={Page1} />
        <Stack.Screen name="New note" component={Page2} />
        <Stack.Screen name="Edit note" component={Page3} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Page1 = ({ navigation, route }) => {
  const [values, loading, error] = useCollection(collection(database, "notes"));
  const data = values?.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  async function deleteDocument(id) {
    await deleteDoc(doc(database, "notes", id));
  }

  return (
    <View style={styles.container}>
      <Button
        title="Add new note"
        onPress={() => navigation.navigate("New note")}
      />
      <FlatList
        data={data}
        renderItem={(note) => (
          <Pressable style={styles.pressableNote}>
            <View style={styles.itemWithDelete}>
              <View style={styles.container}>
                <Text style={styles.noteTitle}>{note.item.title}</Text>
              </View>
              <View style={styles.deleteAndUpdate}>
                <Button
                  title="update"
                  onPress={() =>
                    navigation.navigate("Edit note", {
                      title: note.item.title,
                      text: note.item.text,
                      id: note.item.id,
                    })
                  }
                >
                  {" "}
                </Button>
                <Button
                  title="Delete"
                  onPress={() => deleteDocument(note.item.id)}
                >
                  {" "}
                </Button>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

const Page2 = ({ navigation, route }) => {
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");

  async function saveOnFirebase() {
    try {
      await addDoc(collection(database, "notes"), {
        title: noteTitle,
        text: noteBody,
      });
    } catch (err) {
      console.log(err);
    }
    navigation.navigate("Notes");
  }

  return (
    <View style={styles.containerPage2}>
      <Text style={styles.title}>New Note</Text>
      <TextInput
        style={styles.inputfieldTitle}
        placeholder="Title"
        onChangeText={(txt) => setNoteTitle(txt)}
      />
      <TextInput
        style={styles.inputfieldBody}
        placeholder="Note Content"
        onChangeText={(txt) => setNoteBody(txt)}
        multiline={true}
        numberOfLines={4}
      />
      <Button title="Save" onPress={saveOnFirebase} />
      <Text style={styles.page3Buttons} onPress={() => {
          navigation.navigate("Notes");
        }}>
        {" "}Cancel{" "}
      </Text>
    </View>
  );
};

const Page3 = ({ navigation, route }) => {
  const [updatedText, setUpdatedText] = useState(noteText);
  const [updatedTitle, setUpdatedTitle] = useState(noteTitle);
  const [imagePath, setImagePath] = useState(null)

  const noteTitle = route.params.title;
  const noteText = route.params.text;
  const id = route.params.id;


  async function launchImagePicker() {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true
    })
    if(!result.canceled) {
      setImagePath(result.assets[0].uri)
    }
  }

  useEffect(() => {
   
    getDownloadURL(ref(storage, id + ".jpg"))
      .then((url) => {
        setImagePath(url);
      })
    ;
  }, [id])
;

  async function uploadImage() {
    const res = await fetch(imagePath)
    const blob = await res.blob()
    const storageRef = ref(storage, id+".jpg")
    uploadBytes(storageRef, blob)
  }

  async function updateMyDoc() {
    await uploadImage()
    await updateDoc(doc(database, "notes", id), {
      text: updatedText,
      title: updatedTitle,
    });
  }

  return (
    <View style={styles.containerPage2}>
        <Image style={{height: 200, width: 200, margin: 5}}source={{uri: imagePath}}/>
      <TextInput
        style={styles.inputfieldTitle}
        defaultValue={noteTitle}
        onChangeText={(txt) => setUpdatedTitle(txt)}
      />
      <TextInput
        style={styles.inputfieldBody}
        multiline={true}
        onChangeText={(txt) => setUpdatedText(txt)}
        defaultValue={noteText}
        numberOfLines={4}
      />
      <Text onPress={launchImagePicker} style={styles.page3Buttons}> pick a new image </Text>
      <Text style={styles.page3Buttons} onPress={() => {
          updateMyDoc();
          navigation.navigate("Notes");
        }}
      > update changes</Text>
      <Text style={styles.page3Buttons} onPress={() => {
          navigation.navigate("Notes");
        }}>
        {" "}Cancel{" "}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  containerPage2: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  pressableNote: {
    borderColor: "lightgray",
    borderBottomWidth: 1,
    padding: 15,
    background: "sand",
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  noteBody: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputfieldTitle: {
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "white",
    paddingVertical: 20, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    fontSize: 16,
    width: "80%",
    marginBottom: 15,
    marginTop: 10
  },
  inputfieldBody: {
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "white",
    paddingVertical: 20, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    fontSize: 16,
    width: "80%",
    marginBottom: 15,
    height: 300,
  },
  itemWithDelete: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  deleteAndUpdate: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  page3Buttons: {
    margin: 5, 
    color: 'blue',
    borderWidth: 1,
    borderColor: 'blue'
  }
});
