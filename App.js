import * as warning from "./ignoreWarning";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { useEffect, useState } from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { useRoute } from "./src/router/useRoute";
import { Provider, useSelector } from "react-redux";
import { store } from "./src/redux/store";
// import { db } from "./src/firebase/config";
// import { getAuth } from "firebase/auth";
import { Main } from "./src/components/main/Main";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          "Roboto-Regular": require("./assets/fonts/Roboto/Roboto-Regular.ttf"),
          "Roboto-Medium": require("./assets/fonts/Roboto/Roboto-Medium.ttf"),
        });
        SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
