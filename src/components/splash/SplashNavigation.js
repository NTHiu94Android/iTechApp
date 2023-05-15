import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigation from '../apps/AppNavigation';
import UserNavigation from '../users/UserNavigation';

import { UserContextProvider, UserContext } from '../users/UserContext';
import { AppContextProvider } from '../apps/AppContext';
import { View } from 'react-native';

import messaging from '@react-native-firebase/messaging';

import ProgressDialog from 'react-native-progress-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NavigationApp = () => {
  const { user, onUpdateFcmToken } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  //Lay fcm token luu vao asyncstorage
  useEffect(() => {
    const GetToken = async () => {
      setIsLoading(true);
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      if(user){
        const res = await onUpdateFcmToken(user._id, token);
        if(res) console.log("Update fcm token success splashNavigation: ", res.data.fcmToken);
      }
      await AsyncStorage.setItem('fcmToken', token);
      setIsLoading(false);
    }
    GetToken();
  }, []);
  //Handle notification when app is closed
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      setDataNotifi(remoteMessage);
    });
  }, []);

  return (
    <NavigationContainer independent={true}>
      <ProgressDialog
        visible={isLoading}
        loaderColor="black"
        label="Please wait..." />
      {user ? <AppNavigation /> : <UserNavigation />}
    </NavigationContainer>
  )
}
const SplashNavigation = () => {
  return (
    <View style={{ flex: 1 }}>
      <UserContextProvider>
        <AppContextProvider>
          <NavigationApp />
        </AppContextProvider>
      </UserContextProvider>
    </View>

  )
}

export default SplashNavigation