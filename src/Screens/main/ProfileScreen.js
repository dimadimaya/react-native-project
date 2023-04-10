import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  ImageBackground,
} from "react-native";
import { db } from "../../firebase/config";
import {
  collection,
  where,
  onSnapshot,
  query,
  deleteDoc,
  doc,
  getCountFromServer,
} from "firebase/firestore";
import { authSignOutUser } from "../../redux/auth/authOperations";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { MaterialIcons, Octicons, Fontisto } from "@expo/vector-icons";

export const ProfileScreen = ({ navigation }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [count, setCount] = useState(null);
  const { userId, login } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const signOut = () => {
    dispatch(authSignOutUser());
  };

  const getUserPosts = async () => {
    const postRef = collection(db, "posts");
    const q = query(postRef, where("userId", "==", userId));
    onSnapshot(q, (data) => {
      // console.log(data.docs);
      return setUserPosts(
        data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
  };

  const deletePost = async (postId) => {
    await deleteDoc(doc(db, "posts", postId));
  };

  const getCommentsCount = async () => {
    try {
      const coll = collection(db, "posts", postId, "comments");
      console.log(coll);
      const snapshot = await getCountFromServer(coll);
      setCount(snapshot.data().count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCommentsCount();
    getUserPosts();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/images/bg.jpg")}
        style={styles.image}
      >
        <View style={styles.wrapperPosts}>
          <View style={styles.avatarWrapper}>
            <View style={{ overflow: "hidden", borderRadius: 16 }}>
              <Image
                style={styles.avatar}
                source={require("../../../assets/images/ava.png")}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
            <Octicons name="sign-out" size={24} color="#BDBDBD" />
          </TouchableOpacity>
          <View style={styles.profileNameWrapper}>
            <Text style={styles.profileName}>{login}</Text>
          </View>
          <SafeAreaView style={{ flex: 1 }}>
            <FlatList
              data={userPosts}
              keyExtractor={userPosts.id}
              renderItem={({ item }) => (
                <View>
                  <TouchableOpacity
                    style={styles.deletePostBtn}
                    onPress={() => deletePost(item.id)}
                  >
                    <MaterialIcons name="close" size={26} color="#212121" />
                  </TouchableOpacity>
                  <Image
                    source={{ uri: item.photo }}
                    style={styles.postImage}
                  />
                  <View style={styles.postImageWrapper}>
                    <Text style={styles.postImageTitle}>
                      {item.description}
                    </Text>
                  </View>
                  <View style={styles.postInfoContainer}>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={{ ...styles.postInfoBtn, marginRight: 25 }}
                        activeOpacity={0.7}
                        onPress={() =>
                          navigation.navigate("Comments", {
                            postId: item.id,
                            photo: item.photo,
                          })
                        }
                      >
                        <Fontisto name="comment" size={24} color="#CECDCD" />
                        <Text
                          style={{
                            ...styles.postInfoText,
                            color: item.comments ? "#212121" : "#BDBDBD",
                          }}
                        >
                          item{count}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={styles.postInfoBtn}
                      activeOpacity={0.7}
                      onPress={() =>
                        navigation.navigate("Map", {
                          location: item.location,
                          title: item.description,
                          description: item.place,
                        })
                      }
                    >
                      <Octicons name="location" size={24} color="#BDBDBD" />
                      <Text
                        style={{
                          ...styles.postInfoText,
                          color: "#212121",
                          textDecorationLine: "underline",
                        }}
                      >
                        {item.city} {item.place}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffff0",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  wrapperPosts: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    height: 500,
  },
  profileNameWrapper: { marginTop: 62, marginBottom: 27 },
  profileName: {
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    color: "#212121",
    textAlign: "center",
  },
  logoutBtn: {
    position: "absolute",
    top: 22,
    right: 16,
  },
  deletePostBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 27,
    height: 27,
    backgroundColor: "#fff",
    borderRadius: 50,
    opacity: 0.3,
  },
  avatarWrapper: {
    position: "absolute",
    alignSelf: "center",
    top: -50,
  },
  avatar: {
    width: 120,
    height: 120,
    resizeMode: "cover",
  },
  avatarBtn: {
    position: "absolute",
    bottom: 20,
    right: -15,
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#FF6C00",
    borderRadius: 50,
  },
  postImage: {
    height: 240,
    borderRadius: 8,
    resizeMode: "cover",
  },
  postImageWrapper: {
    marginTop: 8,
  },
  postImageTitle: {
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    color: "#212121",
    marginBottom: 8,
  },
  postInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  postInfoBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  postInfoText: {
    marginLeft: 10,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
  },
});
