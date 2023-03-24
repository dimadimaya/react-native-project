import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Fontisto, Octicons } from "@expo/vector-icons";

export const DefaultScreenPosts = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);

  console.log("route.params", route.params);
  // console.log("route.params", route.params);

  useEffect(() => {
    if (route.params) {
      setPosts((prevState) => [...prevState, route.params]);
    }
  }, [route.params]);
  console.log(posts);

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
                <Text style={styles.userLogin}>Login</Text>
                <Text style={styles.userEmail}>Email</Text>
              </View>
            </View>
            <View style={styles.postsContainer}>
              <Image
                source={{ uri: item.postData.photo }}
                style={styles.postImage}
              />
              <View style={styles.postImageContainer}>
                <Text style={styles.postImageTitle}>
                  {item.postData.description}
                </Text>
              </View>
              <View style={styles.postInfoContainer}>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={styles.postInfoBtn}
                    onPress={toComment}
                  >
                    <Fontisto name="comment" size={24} color="#CECDCD" />
                    <Text style={styles.postInfoText}>0</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.postInfoBtn} onPress={toMap}>
                  <Octicons name="location" size={24} color="#BDBDBD" />
                  <Text style={styles.postInfoText}>{item.postData.place}</Text>
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
