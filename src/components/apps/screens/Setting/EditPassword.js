import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ToastAndroid, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'

import ProgressDialog from 'react-native-progress-dialog';
import { UserContext } from '../../../users/UserContext';
import back from '../../../back/back';

const EditPassword = (props) => {
  const { navigation } = props;
  back(navigation);
  const { onChangePassword, user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isShowPassword, setIsShowPassword] = useState(true);
  const [isShowNewPassword, setIsShowNewPassword] = useState(true);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(true);

  const handleEditPassword = async () => {
    setIsLoading(true);
    if(password == "" || newPassword == "" || confirmPassword == "") {
      ToastAndroid.show("Please fill all fields!", ToastAndroid.SHORT);
      setIsLoading(false);
      return;
    }; 
    if(newPassword != confirmPassword) {
      ToastAndroid.show("New password and confirm password are not the same!", ToastAndroid.SHORT);
      setIsLoading(false);
      return;
    }
    if(password == newPassword) {
      ToastAndroid.show("New password and current password are the same!", ToastAndroid.SHORT);
      setIsLoading(false);
      return;
    }
    if(newPassword.length < 6 || newPassword.length > 20) {
      ToastAndroid.show("New password must be from 6 to 20 characters!", ToastAndroid.SHORT);
      setIsLoading(false);
      return;
    }
    const res = await onChangePassword(user._id, password, newPassword, confirmPassword);
    setIsLoading(false);
    if (res) {
      ToastAndroid.show("Change password successfully!", ToastAndroid.SHORT);
      navigation.goBack();
    } else {
      ToastAndroid.show("Change password failed!", ToastAndroid.SHORT);
    }
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 12, justifyContent: 'space-between', backgroundColor: 'white' }}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{ width: 22, height: 22 }}
            resizeMode='cover'
            source={require('../../../../assets/images/back.png')} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
          <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>Update password</Text>
        </View>

        <View style={{ width: 22, height: 22 }} />
      </View>

      <ProgressDialog
        visible={isLoading}
        loaderColor="black"
        label="Please wait..." />

      <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20, paddingTop: 30 }}>

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
                  source={require('../../../../assets/images/eye.png')}
                />
              </TouchableOpacity> :
              <TouchableOpacity onPress={() => setIsShowPassword(false)} style={{ position: 'absolute', right: 0, top: 30 }}>
                <Image
                  style={{ width: 24, height: 24 }}
                  source={require('../../../../assets/images/eye-off.png')}
                />
              </TouchableOpacity>
          }
          <View style={{ height: 1, backgroundColor: 'black', marginBottom: 20 }} ></View>
        </View>

        {/* New Password */}
        <View style={{ position: 'relative' }}>
          <Text style={{ color: 'black', fontWeight: '800', fontSize: 16, }}>New Password</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="*********"
            style={{}}
            secureTextEntry={isShowNewPassword} />
          {
            !isShowNewPassword ?
              <TouchableOpacity onPress={() => setIsShowNewPassword(true)} style={{ position: 'absolute', right: 0, top: 30 }}>
                <Image
                  style={{ width: 24, height: 24 }}
                  source={require('../../../../assets/images/eye.png')}
                />
              </TouchableOpacity> :
              <TouchableOpacity onPress={() => setIsShowNewPassword(false)} style={{ position: 'absolute', right: 0, top: 30 }}>
                <Image
                  style={{ width: 24, height: 24 }}
                  source={require('../../../../assets/images/eye-off.png')}
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
                  source={require('../../../../assets/images/eye.png')}
                />
              </TouchableOpacity> :
              <TouchableOpacity onPress={() => setIsShowConfirmPassword(false)} style={{ position: 'absolute', right: 0, top: 30 }}>
                <Image
                  style={{ width: 24, height: 24 }}
                  source={require('../../../../assets/images/eye-off.png')}
                />
              </TouchableOpacity>
          }
        </View>

        <TouchableOpacity onPress={() => handleEditPassword()} style={styles.btn}>
          <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }} >Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default EditPassword

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