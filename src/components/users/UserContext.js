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

  // useEffect(() => {
  //   const loginUserCheckRemember = async () => {
  //     const token = await AsyncStorage.getItem('token');
  //     console.log("Login user remember: ",token);
  //     if(token == null) return;
  //     const decoded = jwt_decode(token);
  //     if (decoded.accessToken == "") {
  //       setUser(null);
  //       return;
  //     } else {
  //       setUser(decoded.user);
  //       return;
  //     }
  //   };
  //   loginUserCheckRemember();
  // }, []);

  const onLogin = async (email, password, fcmToken) => {
    try {
      const response = await login(email, password, fcmToken);
      if (response) {
        //console.log("OnLogin Response: ", response);
        const token = response.accessToken;
        await AsyncStorage.setItem('token', token);
        const res = await onUpdateFcmToken(response.data._id, fcmToken);
        setUser(res.data);
        console.log('AccessToken onLogin UserContext: ', token);
        //console.log('FcmToken onLogin UserContext: ', fcmToken);
        //console.log("OnLogin Response after update fcmToken: ", res);
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
      const response = await updateFcmToken(usId, "");
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem('token');
      setUser(null);
      return response;
    } catch (error) {
      console.log('OnLogout Error: ', error);
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
      //console.log("OnRegister Response: ", response.data);
      return response.data;
    } catch (error) {
      console.log("OnRegister Error: ", error);
    }
  };

  const onForgotPassword = async (email) => {
    try {
      const response = await forgot_password(email);
      //console.log("OnForgotPassword Response: ", response.data);
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
