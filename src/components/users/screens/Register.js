import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ToastAndroid, alert, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react';
import back from '../../back/back';
import { UserContext } from '../UserContext';

import ProgressDialog from 'react-native-progress-dialog';

const Register = (props) => {
  const { navigation } = props;
  const { onRegister } = useContext(UserContext);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isShowPassword, setIsShowPassword] = useState(true);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(true);
  const avatar = 'https://api-private.atlassian.com/users/f3ba6e3feb7b6867012f05b2f873affb/avatar';

  back(navigation);

  const handleRegister = async () => {
    // const patternEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    // const checkEmail = patternEmail.test(email);
    // if (!checkEmail) {
    //   ToastAndroid.show('Email is not valid', ToastAndroid.SHORT);
    //   return;
    // }
    if (!username || !password || !name || !confirmPassword) {
      alert('Please fill all the fields');
      return;
    };
    if (password !== confirmPassword) {
      alert('Password and Confirm Password must be the same');
      return;
    };
    if(password.length < 6){
      alert('Password must be at least 6 characters');
      return;
    }
    if(username.length < 6 || username.length > 20){
      alert('Username must be between 6 and 20 characters');
      return;
    }
    setIsLoading(true);
    //username, email, password, name, birthday, numberPhone, avatar
    const user = await onRegister(username, null, password, name, "", "", avatar);
    if (user == null || user == undefined) {
      ToastAndroid.show('Register successfully!', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('Register fail!', ToastAndroid.SHORT);
      navigation.navigate('Login');
    }
    setIsLoading(false);

  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>

      <ProgressDialog
        visible={isLoading}
        loaderColor="black"
        label="Please wait..." />

      <View style={{ alignItems: 'center', paddingHorizontal: 30 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
          <View style={{ height: 1, backgroundColor: 'black', flex: 1 }}></View>
          <Image style={{ width: 50, height: 57 }} source={require('../../../assets/images/logo.png')}></Image>
          <View style={{ height: 1, backgroundColor: 'black', flex: 1 }}></View>
        </View>
        <View style={{ width: "100%" }}>
          <Text style={{ fontWeight: 'bold', color: 'grey', fontSize: 20, marginTop: 20 }} >Wellcome !</Text>
          <Text style={{ fontSize: 25, color: 'black', fontWeight: '800', marginBottom: 20, }} >REGISTER ACCOUNT</Text>
        </View>

        <View style={{ width: '100%', justifyContent: 'center', }}>
          {/* Username */}
          <Text style={{ color: 'black', fontWeight: '800', fontSize: 16, marginTop: 20 }}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Ex: johndoe194@gmail.com" />
          <View style={{ height: 1, backgroundColor: 'black', marginBottom: 20 }} ></View>

          {/* Name */}
          <Text style={{ color: 'black', fontWeight: '800', fontSize: 16, }}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ex: John Doe"/>
          <View style={{ height: 1, backgroundColor: 'black', marginBottom: 20 }} ></View>

          {/* Password */}
          <View style={{ position: 'relative' }}>
            <Text style={{ color: 'black', fontWeight: '800', fontSize: 16, }}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="*********"
              style={{}}
              secureTextEntry={isShowPassword} />
            {
              !isShowPassword ?
                <TouchableOpacity onPress={() => setIsShowPassword(true)} style={{ position: 'absolute', right: 0, top: 30 }}>
                  <Image
                    style={{ width: 24, height: 24 }}
                    source={require('../../../assets/images/eye.png')}
                  />
                </TouchableOpacity> :
                <TouchableOpacity onPress={() => setIsShowPassword(false)} style={{ position: 'absolute', right: 0, top: 30 }}>
                  <Image
                    style={{ width: 24, height: 24 }}
                    source={require('../../../assets/images/eye-off.png')}
                  />
                </TouchableOpacity>
            }
            <View style={{ height: 1, backgroundColor: 'black', marginBottom: 20 }} ></View>
          </View>

          {/* Confirm password */}
          <View style={{ position: 'relative' }}>
            <Text style={{ color: 'black', fontWeight: '800', fontSize: 16, }}>Confirm password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="*********"
              style={{}}
              secureTextEntry={isShowConfirmPassword} />
            <View style={{ height: 1, backgroundColor: 'black', marginBottom: 20 }} ></View>
            {
              !isShowConfirmPassword ?
                <TouchableOpacity onPress={() => setIsShowConfirmPassword(true)} style={{ position: 'absolute', right: 0, top: 30 }}>
                  <Image
                    style={{ width: 24, height: 24 }}
                    source={require('../../../assets/images/eye.png')}
                  />
                </TouchableOpacity> :
                <TouchableOpacity onPress={() => setIsShowConfirmPassword(false)} style={{ position: 'absolute', right: 0, top: 30 }}>
                  <Image
                    style={{ width: 24, height: 24 }}
                    source={require('../../../assets/images/eye-off.png')}
                  />
                </TouchableOpacity>
            }
          </View>

          <TouchableOpacity onPress={() => handleRegister()} style={styles.btn}>
            <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }} >SIGN UP</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: 'black', fontWeight: '600', textAlign: 'center', marginTop: 10 }} >Already have account? SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default Register

const styles = StyleSheet.create({
  btn: {
    width: '80%',
    height: 50,
    backgroundColor: 'black',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  }
})