import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ToastAndroid, alert, ScrollView } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'

import ProgressDialog from 'react-native-progress-dialog';
import * as ImagePicker from 'react-native-image-picker';

import { UserContext } from '../../../users/UserContext';
import back from '../../../back/back';
import { AppContext } from '../../AppContext';

const UpdateProfile = (props) => {
  const { navigation } = props;
  back(navigation);
  const { user, setUser, onUpdateProfile } = useContext(UserContext);
  const { onUploadPicture } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [numberPhone, setNumberPhone] = useState('');
  const [image, setImage] = useState(user.avatar);
  const [file, setFile] = useState({});

  useEffect(() => {
    if(user.email == null){
      setEmail('');
    }else{
      setEmail(user.email);
    }
    setName(user.name);
    setBirthday(user.birthday);
    setNumberPhone(user.numberPhone);
  }, []);

  //Xu ly chon anh
  const handleChoosePhoto = async () => {
    const options = {
      mediaType: 'photo',
      //includeBase64: false,
      //maxFiles: undefined,
      selectionLimit: 1, // Số lượng hình ảnh tối đa có thể chọn
      multiple: true,
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      allowsEditing: true,
      noData: true,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('Image selection cancelled');
      } else if (response.error) {
        console.log('Error selecting images: ', response.error);
      } else if (response.assets) {
        const selectedImages = response.assets.map((asset) => asset.uri);
        console.log('res assets: ', response.assets);
        console.log('selectedImages: ', selectedImages);
        setImage(selectedImages[0]);
        setFile(response.assets[0]);
      }
    });
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      //Check input
      if (!name || !birthday || !numberPhone || !email) {
        setIsLoading(false);
        return alert('Please enter all fields');
      }
      let avatar = user.avatar;
      //upload avatar
      if (image != user.avatar) {
        //Upload picture
        const formData = new FormData();
        formData.append('picture', {
          uri: file.uri,
          type: file.type,
          name: file.fileName,
        });
        const resPicture = await onUploadPicture(formData);
        avatar = resPicture.data;
      }
      //Call api update profile
      const userUpdate = await onUpdateProfile(user._id, email, name, birthday, numberPhone, avatar);
      console.log('userUpdate', userUpdate);
      if(userUpdate == null || userUpdate == undefined){
        ToastAndroid.show('Update profile failed', ToastAndroid.SHORT);
      }
      if (userUpdate) {
        ToastAndroid.show('Update profile successfully', ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      console.log('handleUpdateAvatar error', error);
    }
    setIsLoading(false);
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
          <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>Update profile</Text>
        </View>

        <View style={{ width: 22, height: 22 }} />
      </View>

      <ProgressDialog
        visible={isLoading}
        loaderColor="black"
        label="Please wait..." />

      <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20, paddingTop: 30 }}>

        {/* Avatar */}
        <View style={styles.avatar}>
          <Image
            style={{ width: 120, height: 120, borderRadius: 120, }}
            resizeMode='cover'
            source={{ uri: image }} />
          <TouchableOpacity onPress={handleChoosePhoto} style={{ position: 'absolute', right: 5, bottom: 5 }}>
            <Image
              style={{ width: 20, height: 20, }}
              resizeMode='cover'
              source={require('../../../../assets/images/edit.png')} />
          </TouchableOpacity>
        </View>

        {/* Email */}
        <View style={{ position: 'relative' }}>
          <Text style={{ color: 'black', fontWeight: '800', fontSize: 16, }}>Email</Text>
          {
            user.loginType == 'username' ?
              <TextInput
                value={email}
                onChangeText={setEmail}
              /> :
              <Text style={{ fontWeight: '400', fontSize: 14, marginVertical: 14 }}>{user.email}</Text>
          }
          <View style={{ height: 1, backgroundColor: 'black', marginBottom: 20 }} ></View>
        </View>

        {/* Name */}
        <View style={{ position: 'relative' }}>
          <Text style={{ color: 'black', fontWeight: '800', fontSize: 16, }}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={{}} />
          <View style={{ height: 1, backgroundColor: 'black', marginBottom: 20 }} ></View>
        </View>

        {/* Birthday */}
        <View style={{ position: 'relative' }}>
          <Text style={{ color: 'black', fontWeight: '800', fontSize: 16, }}>Birthday</Text>
          <TextInput
            value={birthday}
            onChangeText={setBirthday} />
          <View style={{ height: 1, backgroundColor: 'black', marginBottom: 20 }} ></View>
        </View>

        {/* Number phone */}
        <View style={{ position: 'relative' }}>
          <Text style={{ color: 'black', fontWeight: '800', fontSize: 16, }}>Number phone</Text>
          <TextInput
            value={numberPhone}
            onChangeText={setNumberPhone} />
          <View style={{ height: 1, backgroundColor: 'black', marginBottom: 20 }} ></View>
        </View>

        <TouchableOpacity onPress={() => handleUpdateProfile()} style={styles.btn}>
          <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }} >Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default UpdateProfile

const styles = StyleSheet.create({
  btn: {
    width: '80%',
    height: 50,
    backgroundColor: 'black',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  avatar: {
    marginBottom: 20, position: 'relative',
    // borderRadius: 120, borderColor: 'black', borderWidth: 2, 
    //width: 130, height: 130, 
    width: 120, height: 120,
    alignSelf: 'center',
    justifyContent: 'center', alignItems: 'center'
  }

})