import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

import Started from './src/components/splash/Started';

const App = () => {
  useEffect(() => {
    const GetToken = async () => {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      //console.log("Token firebase: ", token);
      AsyncStorage.setItem('fcmToken', token);
    }
    GetToken();
  }, []);

  return (
    <Started />
  )
}

export default App