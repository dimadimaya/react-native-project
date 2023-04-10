import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { CommentsScreen } from "../nestedScreens/CommentsScreen";
import { DefaultScreenPosts } from "../nestedScreens/DefaultScreenPosts";
import { authSignOutUser } from "../../redux/auth/authOperations";
import { MapScreen } from "../nestedScreens/MapScreen";
import { Octicons, AntDesign } from "@expo/vector-icons";

const NestedScreen = createStackNavigator();

export const PostsScreen = () => {
  const dispatch = useDispatch();

  const signOut = () => {
    dispatch(authSignOutUser());
  };
  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        name="DefaultScreen"
        component={DefaultScreenPosts}
        options={{
          title: "Publications",
          headerTitleAlign: "center",
          headerRight: () => (
            <TouchableOpacity onPress={signOut} style={{ marginRight: 16 }}>
              <Octicons name="sign-out" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          ),
        }}
      />
      <NestedScreen.Screen name="Comments" component={CommentsScreen} />
      <NestedScreen.Screen name="Map" component={MapScreen} />
    </NestedScreen.Navigator>
  );
};
