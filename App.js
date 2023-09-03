import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Pressable,
  FlatList,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native"; // npm install @react-navigation/native
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // npm install @react-navigation/native-stack

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Page1">
        <Stack.Screen name="Page1" component={Page1} />
        <Stack.Screen name="Page2" component={Page2} />
        <Stack.Screen name="Page3" component={Page3} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Page1 = ({ navigation, route }) => {
  const [notes, setNotes] = useState([]);
  const { noteTitle, noteBody } = route.params ?? {};

  useEffect(() => {
    if (noteTitle && noteBody) {
      const newNote = {
        title: noteTitle,
        body: noteBody,
      };
      setNotes((prevNotes) => [...prevNotes, newNote]);
    }
  }, [noteTitle, noteBody]);

  const renderItem = ({ item }) => (
    <Pressable style={styles.pressableNote} onPress={() => navigation.navigate("Page3")}>
      <Text style={styles.noteTitle}>
        {item.title}
      </Text>
    </Pressable>
  );
  

  return (
    <View style={styles.container}>
      <Button
        title="Add new note"
        onPress={() => navigation.navigate("Page2")}
      />
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const Page2 = ({ navigation, route }) => {
  const [editedTitle, setEditedTitle] = useState("");
  const [editedBody, setEditedBody] = useState("");

  const saveEditedNote = () => {
    const newNote = {
      title: editedTitle,
      body: editedBody,
    };
    navigation.navigate("Page1", {
      noteTitle: newNote.title,
      noteBody: newNote.body,
    });
  };

  return (
    <View style={styles.containerPage2}>
      <Text style={styles.title}>New Note</Text>
      <TextInput
        style={styles.inputfieldTitle}
        placeholder="Title"
        onChangeText={(txt) => setEditedTitle(txt)}
        value={editedTitle}
      />
      <TextInput
        style={styles.inputfieldBody}
        placeholder="Note Content"
        onChangeText={(txt) => setEditedBody(txt)}
        value={editedBody}
        multiline={true}
        numberOfLines={4}
      />
      <Button title="Save" onPress={saveEditedNote} />
    </View>
  );
};

const Page3 = ({ navigation, route }) => {
  const { noteTitle, noteBody } = route.params ?? {};

  return (
    <View style={styles.containerPage2}>
      <TextInput style={styles.inputfieldTitle} value={noteTitle} />
      <TextInput
        style={styles.inputfieldBody}
        value={noteBody}
        multiline={true}
        numberOfLines={4}
      />
      <Button title="Back" onPress={navigation.navigate("Page1")} />
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
});
