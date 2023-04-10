import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, onSnapshot, getCountFromServer } from "firebase/firestore";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Fontisto, Octicons } from "@expo/vector-icons";

export const DefaultScreenPosts = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  const getAllPosts = async () => {
    const postsRef = collection(db, "posts");
    onSnapshot(postsRef, (data) => {
      // console.log(data);
      return setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  };

  useEffect(() => {
    getAllPosts();
  }, []);
  // console.log(posts);

  const toMap = () => {
    navigation.navigate("Map");
  };
  const toComment = () => {
    navigation.navigate("Comments");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View>
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={require("../../../assets/images/ava.png")}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userLogin}>{item.login}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
              </View>
            </View>
            <View style={styles.postsContainer}>
              <Image source={{ uri: item.photo }} style={styles.postImage} />
              <View style={styles.postImageContainer}>
                <Text style={styles.postImageTitle}>{item.description}</Text>
              </View>
              <View style={styles.postInfoContainer}>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={styles.postInfoBtn}
                    onPress={() =>
                      navigation.navigate("Comments", {
                        postId: item.id,
                        photo: item.photo,
                      })
                    }
                  >
                    <Fontisto name="comment" size={24} color="#CECDCD" />
                    <Text style={styles.postInfoText}></Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.postInfoBtn}
                  onPress={() =>
                    navigation.navigate("Map", { location: item.location })
                  }
                >
                  <Octicons name="location" size={24} color="#BDBDBD" />
                  <Text style={styles.postInfoText}>{item.place}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
  },
  avatar: {
    width: 60,
    height: 60,
  },
  userInfo: {
    marginLeft: 10,
  },
  userLogin: {
    fontFamily: "Roboto-Medium",
    fontSize: 14,
    color: "#212121",
  },
  userEmail: {
    fontFamily: "Roboto-Regular",
    fontSize: 12,
  },
  postsContainer: {
    paddingHorizontal: 16,
  },
  postImage: {
    width: "100%",
    height: 240,
    borderRadius: 8,
  },
  postImageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    marginBottom: 16,
  },
  postInfoBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  postInfoText: {
    marginLeft: 10,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#212121",
  },
});
