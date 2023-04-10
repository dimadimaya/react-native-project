import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState, useEffect } from "react";
import { db, storage } from "../../firebase/config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSelector } from "react-redux";
import { collection, addDoc } from "firebase/firestore";
import { Camera } from "expo-camera";

import { AntDesign } from "@expo/vector-icons";
import * as Location from "expo-location";
import { EvilIcons } from "@expo/vector-icons";

const initialPostData = {
  photo: "",
  description: "",
  place: "",
};

export const CreatePostsScreen = ({ navigation }) => {
  const [postData, setPostData] = useState(initialPostData);
  const [camera, setCamera] = useState(null);
  const [location, setLocation] = useState(null);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const { userId, login, email } = useSelector((state) => state.auth);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsShowKeyboard(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsShowKeyboard(false);
      }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const handleInput = (type, value) => {
    setPostData((prevState) => ({ ...prevState, [type]: value }));
  };

  const takePhoto = async () => {
    // console.log(postData.description);
    // console.log(location);
    try {
      const photo = await camera.takePictureAsync();
      const location = await Location.getCurrentPositionAsync({});
      // console.log("location", location);
      // console.log(location.coords.latitude);
      // console.log(location.coords.longitude);
      setLocation(location);
      setPostData((prevState) => ({ ...prevState, photo: photo.uri }));
      // console.log(photo.uri);
    } catch (error) {
      console.log(error.message);
    }
  };

  const sendFoto = () => {
    uploadPostToServer();
    navigation.navigate("DefaultScreen");
    // navigation.navigate("DefaultScreen", { postData });
    // console.log("navigation", navigation);
    setPostData(initialPostData);
  };

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();
    try {
      const setUserPost = await addDoc(collection(db, "posts"), {
        photo,
        description: postData.description,
        place: postData.place,
        location: location.coords,
        userId,
        login,
        email,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const uploadPhotoToServer = async () => {
    try {
      const response = await fetch(postData.photo);
      const file = await response.blob();
      // console.log(file);
      await uploadBytes(ref(storage, `postImage/${file._data.blobId}`), file);

      const photoUrl = await getDownloadURL(
        ref(storage, `postImage/${file._data.blobId}`)
      );
      // console.log(photoUrl);
      return photoUrl;
    } catch (error) {
      console.log(error);
    }
    return photoUrl;
  };

  const remove = () => {
    setPostData(initialPostData);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      }
      setLocation(location);
    })();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        {postData.photo ? (
          <View>
            <Image source={{ uri: postData.photo }} style={styles.photo} />
          </View>
        ) : (
          <Camera style={styles.camera} ref={setCamera}>
            <TouchableOpacity onPress={takePhoto} style={styles.iconContainer}>
              <AntDesign style={styles.icon} name="camera" size={24} />
            </TouchableOpacity>
          </Camera>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={{ ...styles.input, marginBottom: 16 }}
            placeholder="Title..."
            onFocus={() => setIsShowKeyboard(true)}
            value={postData.description}
            onChangeText={(value) => handleInput("description", value)}
          />
          <TextInput
            style={{ ...styles.input, paddingLeft: 28 }}
            placeholder="Location..."
            onFocus={() => setIsShowKeyboard(true)}
            value={postData.place}
            onChangeText={(value) => handleInput("place", value)}
          />
          <EvilIcons
            style={{
              position: "absolute",
              top: 70,
              left: 16,
              color: "#CECDCD",
            }}
            name="location"
            size={24}
            color="black"
          />
        </View>
        <TouchableOpacity
          onPress={sendFoto}
          disabled={!postData.photo}
          style={{
            ...styles.sendBtn,
            backgroundColor: postData.photo ? "#FF6C00" : "#F6F6F6",
          }}
        >
          <Text
            style={{
              ...styles.btnTitle,
              color: postData.photo ? "#fff" : "#BDBDBD",
            }}
          >
            Publish
          </Text>
        </TouchableOpacity>
        <View style={styles.removeContainer}>
          <TouchableOpacity
            onPress={remove}
            disabled={!postData.photo}
            style={{
              ...styles.removeBtn,
              backgroundColor: postData.photo ? "#FF6C00" : "#F6F6F6",
            }}
          >
            <AntDesign
              style={{
                ...styles.removeIcon,
                color: postData.photo ? "#fff" : "#BDBDBD",
              }}
              name="delete"
              size={24}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  camera: {
    height: 240,
    marginTop: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    height: 240,
    borderRadius: 8,
  },
  iconContainer: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    position: "absolute",
    color: "#fff",
  },
  inputContainer: {
    position: "relative",
    marginTop: 22,
  },
  input: {
    height: 45,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#212121",
  },
  sendBtn: {
    textAlign: "center",
    marginTop: 32,
    paddingVertical: 16,
    backgroundColor: "#FF6C00",
    borderRadius: 100,
  },
  btnTitle: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Roboto-Regular",
  },
  removeContainer: {
    display: "flex",
    // justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 80,
  },
  removeBtn: {
    display: "flex",
    width: 70,
    height: 70,
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
