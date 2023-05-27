import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, ToastAndroid, ScrollView, Alert } from 'react-native'
import React, { useContext, useState } from 'react';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressDialog from 'react-native-progress-dialog';

import { UserContext } from '../UserContext';

const Login = (props) => {
  const { navigation } = props;
  const { onLogin, onRegister } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  GoogleSignin.configure({
    webClientId: '13705249458-n11h88g38semsu2teplnr0fo05tdnrks.apps.googleusercontent.com',
  });


  const handleLogin = async () => {
    setIsLoading(true);
    if (!username || !password) {
      //neu tren android
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravityAndOffset('Please fill all the fields!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50);
      } else {
        Alert.alert('Please fill all the fields!');
      }
      setIsLoading(false);
      return;
    } else {
      const fcmToken = await AsyncStorage.getItem('fcmToken');
      const res = await onLogin(username, null, password, fcmToken);
      if (res != null || res != undefined) {
        console.log("Login success!");
      } else {
        //neu tren android
        if (Platform.OS === 'android') {
          ToastAndroid.showWithGravityAndOffset('Login fail!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50);
        } else {
          Alert.alert('Login fail!');
        }
      }
      setIsLoading(false);
    }
  };

  //Login with Google
  const onGoogleButtonPress = async () => {
    try {
      setIsLoading(true);
      console.log("onGoogleButtonPress");
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // Sign-in the user with the credential
      const userInfor = await auth().signInWithCredential(googleCredential);
      //console.log(userInfor);
      //Lay object user tu userInfor
      const userResult = userInfor.user;
      //console.log(userResult.photoURL);

      const fcmToken = await AsyncStorage.getItem('fcmToken');
      //console.log("FCM Token Login screen: ", fcmToken);
      const usLogin = await onLogin(null, userResult.email, userResult.uid, fcmToken);
      if (usLogin) {
        console.log("Login success");
      } else if (usLogin == null || usLogin == undefined) {
        //username, email, password, name, birthday, address, numberPhone, avatar
        const usRegister = await onRegister(null, userResult.email, userResult.uid, userResult.displayName, "", "", userResult.photoURL);
        if (usRegister) {
          console.log("Register success");
          const res = await onLogin(null, userResult.email, userResult.uid, fcmToken);
          if (res) {
            console.log("Login success after register");
          } else {
            console.log("Login fail");
          }
        }
      } else {
        console.log("Login fail");
      };
      setIsLoading(false);
    } catch (error) {
      console.log("Error onGoogleButtonPress: ", error);
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>

      <ProgressDialog
        visible={isLoading}
        loaderColor="black"
        label="Please wait..." />

      <View style={{ flex: 1, backgroundColor: 'white', marginTop: 50, paddingHorizontal: 50 }}>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
          <View style={{ height: 1, backgroundColor: 'black', flex: 1 }}></View>
          <Image style={{ width: 50, height: 57, marginHorizontal: 10 }} source={require('../../../assets/images/logo.png')}></Image>
          <View style={{ height: 1, backgroundColor: 'black', flex: 1 }}></View>
        </View>

        <View>
          <Text style={{ fontWeight: 'bold', color: 'grey', fontSize: 25, }} >Hello !</Text>
          <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 20, }} >WELCOME BACK</Text>

          <View style={{}}>
            <Text style={{ color: 'black', fontWeight: '800', fontSize: 16, marginTop: 40 }}>Username</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              style={{}} />
            <View style={{ height: 1, backgroundColor: 'black', }} ></View>
          </View>

          <View style={{position: 'relative'}}>
            <Text style={{ color: 'black', fontWeight: '800', fontSize: 16, marginTop: 20 }}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              style={{}}
              secureTextEntry={isShowPassword} />
            {
              !isShowPassword ?
                <TouchableOpacity onPress={() => setIsShowPassword(true)} style={{ position: 'absolute', right: 0, top: 55}}>
                  <Image
                    style={{ width: 24, height: 24 }}
                    source={require('../../../assets/images/eye.png')}
                  />
                </TouchableOpacity> :
                <TouchableOpacity onPress={() => setIsShowPassword(false)} style={{ position: 'absolute', right: 0, top: 55 }}>
                  <Image
                    style={{ width: 24, height: 24 }}
                    source={require('../../../assets/images/eye-off.png')}
                  />
                </TouchableOpacity>
            }
            <View style={{ height: 1, backgroundColor: 'black', marginBottom: 20 }} ></View>
          </View>

          <TouchableOpacity style={styles.btn} onPress={() => handleLogin()}>
            <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }} >Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={() => onGoogleButtonPress()}>
            <Image style={{ width: 20, height: 20, marginRight: 10 }} source={require('../../../assets/images/google.png')}></Image>
            <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }} >Login By Google</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: 'black', fontWeight: '600', textAlign: 'center' }}>Do you have account ? </Text>
            <Text
              style={{ color: 'black', fontWeight: '600', textAlign: 'center', marginLeft: 4, textDecorationLine: 'underline' }}
              onPress={() => navigation.navigate('Register')} >
              Signup
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={{ color: 'black', fontWeight: '600', textAlign: 'center', marginTop: 8, textDecorationLine: 'underline' }}>
              Forgot password
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </ScrollView>
  )
}

export default Login

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: 'black',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  }
})