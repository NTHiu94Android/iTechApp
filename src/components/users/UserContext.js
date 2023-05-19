import React, { createContext, useState, useEffect } from 'react'
import { login, register, updateFcmToken, forgot_password } from './UserService';
import AsyncStorage from '@react-native-async-storage/async-storage';

import jwt_decode from "jwt-decode";

import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const UserContext = createContext();

export const UserContextProvider = (props) => {
  const { children } = props;
  const [user, setUser] = useState(null);

  GoogleSignin.configure({
    webClientId: '13705249458-n11h88g38semsu2teplnr0fo05tdnrks.apps.googleusercontent.com'
  });

  useEffect(() => {
    const loginUserCheckRemember = async () => {
      const token = await AsyncStorage.getItem('token');
      console.log("Login user remember: ",token);
      if(token == null) return;
      const decoded = jwt_decode(token);
      if (decoded.accessToken == "") {
        setUser(null);
        return;
      } else {
        setUser(decoded.user);
        return;
      }
    };
    loginUserCheckRemember();
  }, []);

  const onLogin = async (email, password, fcmToken) => {
    try {
      const response = await login(email, password, fcmToken);
      if (response) {
        const token = response.accessToken;
        await AsyncStorage.setItem('token', token);
        const res = await onUpdateFcmToken(response.data._id, fcmToken);
        setUser(res.data);
        console.log('AccessToken onLogin UserContext: ', token);
        return res.data;
      }
      return null;
    } catch (error) {
      console.log("OnLogin Error: ", error);
      setUser(null);
      return null;
    }
  };

  const onLogout = async (usId) => {
    try {
      await AsyncStorage.removeItem('idUser');
      await AsyncStorage.removeItem('token');
      await onUpdateFcmToken(usId, "");
      await GoogleSignin.signOut();

      setUser(null);

      return true;
    } catch (e) {
      console.log(e);
    }
  };

  const onUpdateFcmToken = async (usId, tokenFcm) => {
    try {
      const respone = await updateFcmToken(usId, tokenFcm);
      return respone;
    } catch (error) {
      console.log("OnUpdateFcmToken Error: ", error);
    }
  };

  const onRegister = async (email, password, name, birthday, numberPhone, avatar) => {
    try {
      const response = await register(email, password, name, birthday, numberPhone, avatar);
      return response.data;
    } catch (error) {
      console.log("OnRegister Error: ", error);
    }
  };

  const onForgotPassword = async (email) => {
    try {
      const response = await forgot_password(email);
      return response.data;
    } catch (error) {
      console.log("OnForgotPassword Error: ", error);
    }
  }


  return (
    <UserContext.Provider value={{ user, setUser, onLogin, onLogout, onRegister, onUpdateFcmToken, onForgotPassword }}>
      {children}
    </UserContext.Provider>
  )
}
