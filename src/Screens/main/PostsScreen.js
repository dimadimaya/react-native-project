import { createStackNavigator } from "@react-navigation/stack";
import { CommentsScreen } from "../nestedScreens/CommentsScreen";
import { DefaultScreenPosts } from "../nestedScreens/DefaultScreenPosts";
import { MapScreen } from "../nestedScreens/MapScreen";

const NestedScreen = createStackNavigator();

export const PostsScreen = () => {
  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        name="DefaultScreen"
        component={DefaultScreenPosts}
      />
      <NestedScreen.Screen name="Comments" component={CommentsScreen} />
      <NestedScreen.Screen name="Map" component={MapScreen} />
    </NestedScreen.Navigator>
  );
};
