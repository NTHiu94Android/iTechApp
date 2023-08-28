import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigation from '../apps/AppNavigation';
import UserNavigation from '../users/UserNavigation';

import { UserContextProvider, UserContext } from '../users/UserContext';
import { AppContextProvider, AppContext } from '../apps/AppContext';
import { View } from 'react-native';

import messaging from '@react-native-firebase/messaging';

import ProgressDialog from 'react-native-progress-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";

const NavigationApp = () => {
  //const [isLoading, setIsLoading] = useState(true);
  const { user, onUpdateFcmToken } = useContext(UserContext);
  const {
    onGetCategories, onGetProducts, onGetSubProducts,
    onGetReviews, countOrderDetail,
    setObjRef, getOrderByIdUserAndStatus,
    onGetBrandsByIdCategory, onGetPictures,
  } = useContext(AppContext);

  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const getOrder = async () => {
  //     setIsLoading(true);
  //     const token = await AsyncStorage.getItem('token');
  //     //console.log("Login user remember: ",token);
  //     if (token == null) return;
  //     const decoded = jwt_decode(token);
  //     if (decoded.accessToken == "") {
  //       setIsLoading(false);
  //       return;
  //     } else {
  //       await getOrderByIdUserAndStatus(decoded.user);
  //       setIsLoading(false);
  //     }
  //   };
  //   getOrder();
  // }, []);


  //Lay fcm token luu vao asyncstorage
  useEffect(() => {
    const GetToken = async () => {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      if (user) {
        const res = await onUpdateFcmToken(user._id, token);
        if (res) console.log("Update fcm token success splashNavigation: ", res.data.fcmToken);
      }
      await AsyncStorage.setItem('fcmToken', token);
    }
    GetToken();
    getData();
  }, [countOrderDetail, user]);

  const getData = async () => {
    try {
      const resProduct = await onGetProducts();
      const resCategory = await onGetCategories();
      const resReview = await onGetReviews();
      const resSubProduct = await onGetSubProducts();
      const resPictures = await onGetPictures();

      const listCategories = resCategory.data;
      let listBrands = [];
      for (let i = 0; i < listCategories.length; i++) {
        const resBrands = await onGetBrandsByIdCategory(listCategories[i]._id);
        listBrands.push(resBrands.data);
      }
      const refContext = {
        current: {
          listProducts: resProduct,
          listSubProducts: resSubProduct,
          listPictures: resPictures,
          listCategories: resCategory,
          listBrands: listBrands,
          listReviews: resReview,
        }
      }
      setObjRef(refContext);
    } catch (error) {
      console.log("Error splash navigation : ", error);
    }
  };
  //Handle notification when app is closed
  // useEffect(() => {
  //   messaging().setBackgroundMessageHandler(async remoteMessage => {
  //     console.log('Message handled in the background!', remoteMessage);
  //     setDataNotifi(remoteMessage);
  //   });
  // }, []);

  return (
    <NavigationContainer independent={true}>
      {/* <ProgressDialog
        visible={isLoading}
        loaderColor="black"
        label="Please wait..." /> */}
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