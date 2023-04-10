import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  SafeAreaView,
  Keyboard,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { db } from "../../firebase/config";
import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";

export const CommentsScreen = ({ route }) => {
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const { postId, photo } = route.params;
  const { login, userId } = useSelector((state) => state.auth);
  // console.log(allComments);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const handleSetComment = (text) => setComment(text);

  const createPost = async () => {
    if (comment.trim()) {
      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();
      await addDoc(collection(db, "posts", postId, "comments"), {
        comment,
        userId,
        date,
        time,
        login,
      });
      keyboardHide();
      setComment("");
    } else {
      Alert.alert("Write comment");
    }
  };

  const getAllComments = async () => {
    try {
      const postsRef = collection(db, "posts", postId, "comments");
      onSnapshot(postsRef, (data) => {
        // console.log(data);
        setAllComments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAllComments();
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

  const renderItem = ({ item }) => {
    // console.log(item);
    const currentUser = userId === item.userId;

    return (
      <View
        style={{
          marginTop: 32,
          flexDirection: currentUser ? "row-reverse" : "row",
        }}
      >
        <Image
          source={require("../../../assets/images/ava.png")}
          style={{
            ...styles.avatarIcon,
            marginRight: currentUser ? 15 : 0,
            marginLeft: currentUser ? 0 : 15,
          }}
        />
        <View style={styles.comment}>
          <Text
            style={{
              ...styles.commentAuthor,
              textAlign: currentUser ? "right" : "left",
            }}
          >
            {currentUser ? "You" : item.login}
          </Text>
          <Text
            style={{
              ...styles.commentMessage,
              textAlign: currentUser ? "left" : "right",
            }}
          >
            {item.comment}
          </Text>
          <Text
            style={{
              ...styles.commentDate,
              textAlign: currentUser ? "left" : "right",
            }}
          >
            {item.date} | {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={{ ...styles.container }}>
        <Image
          source={{ uri: photo }}
          style={{ height: 240, borderRadius: 8 }}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            data={allComments}
            keyExtractor={allComments.id}
            renderItem={renderItem}
          />
        </SafeAreaView>

        <View style={styles.inputContainer}></View>
        <View>
          <TextInput
            value={comment}
            onChangeText={handleSetComment}
            placeholder="Сomment..."
            onFocus={() => setIsShowKeyboard(true)}
            style={{
              ...styles.submitBtn,
              // fontFamily: "Roboto",
            }}
          />

          <TouchableOpacity
            style={styles.addCommentBtn}
            activeOpacity={0.7}
            onPress={createPost}
          >
            <AntDesign name="arrowup" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 32,
    backgroundColor: "#fff",
  },
  avatarIcon: {
    height: 40,
    width: 40,
    borderRadius: 50,
    overflow: "hidden",
    resizeMode: "cover",
  },
  comment: {
    marginLeft: 16,
    padding: 14,
    width: 300,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  commentMessage: {
    marginBottom: 5,
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    color: "#212121",
  },
  commentDate: {
    fontFamily: "Roboto-Regular",
    fontSize: 10,
    color: "#BDBDBD",
  },
  submitBtn: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    padding: 16,
    height: 50,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: "#e8e8e8",
    backgroundColor: "#f6f6f6",
  },
  addCommentBtn: {
    position: "absolute",
    right: 6,
    bottom: 5,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    backgroundColor: "#FF6C00",
    borderRadius: 50,
  },
  commentAuthor: {
    marginBottom: 5,
    fontFamily: "Roboto-Medium",
    fontSize: 11,
    color: "#656565",
  },
});
