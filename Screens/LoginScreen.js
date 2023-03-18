import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Button,
  Platform,
} from "react-native";

const initState = {
  email: "",
  password: "",
};

export const LoginScreen = () => {
  const [state, setState] = useState(initState);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    console.log(state);
    setState(initState);
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsShowKeyboard(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsShowKeyboard(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/images/bg.jpg")}
          style={styles.image}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : ""}
          >
            <View
              style={{
                ...styles.form,
                paddingBottom: isShowKeyboard ? 32 : 144,
              }}
            >
              <Text style={styles.title}>Войти</Text>
              <TextInput
                style={{
                  ...styles.input,
                  marginBottom: 16,
                  borderColor: state.email ? "#FF6C00" : "#E8E8E8",
                  backgroundColor: state.email ? "#FFF" : "#F6F6F6",
                }}
                textAlign={"left"}
                placeholder="Адрес электронной почты"
                onFocus={() => {
                  setIsShowKeyboard(true);
                }}
                onChangeText={(value) =>
                  setState((prevState) => ({ ...prevState, email: value }))
                }
                value={state.email}
              />
              <TextInput
                style={{
                  ...styles.input,
                  borderColor: state.password ? "#FF6C00" : "#E8E8E8",
                  backgroundColor: state.password ? "#FFF" : "#F6F6F6",
                }}
                textAlign={"left"}
                placeholder="Пароль"
                secureTextEntry={true}
                onFocus={() => {
                  setIsShowKeyboard(true);
                }}
                onChangeText={(value) =>
                  setState((prevState) => ({ ...prevState, password: value }))
                }
                value={state.password}
              />
              {!isShowKeyboard && (
                <>
                  <TouchableOpacity
                    style={styles.btn}
                    activeOpacity={0.8}
                    onPress={keyboardHide}
                  >
                    <Text style={styles.btnTitle}>Войти</Text>
                  </TouchableOpacity>
                  <Text style={styles.subtitle}>
                    Нет аккаунта? Зарегистрироваться
                  </Text>
                </>
              )}
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  title: {
    color: "black",
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    marginBottom: 32,
    textAlign: "center",
  },
  form: {
    position: "relative",
    paddingHorizontal: 16,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: "center",
    paddingTop: 32,
  },
  input: {
    padding: 16,
    height: 50,
    width: "100%",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#212121",
  },
  btn: {
    width: "100%",
    marginTop: 43,
    marginBottom: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#FF6C00",
    borderRadius: 100,
  },
  btnTitle: {
    color: "#fff",
    fontSize: 16,
  },
  subtitle: {
    textAlign: "center",
  },
});
