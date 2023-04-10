import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRoute } from "../../router/useRoute";
import { NavigationContainer } from "@react-navigation/native";
import { authStateChangeUser } from "../../redux/auth/authOperations";

export const Main = () => {
  const { stateChange } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  //   console.log(state);
  //   const auth = getAuth();
  //   auth.onAuthStateChanged((user) => setUser(user));

  useEffect(() => {
    dispatch(authStateChangeUser());
  }, []);

  const routing = useRoute(stateChange);

  return <NavigationContainer>{routing}</NavigationContainer>;
};
