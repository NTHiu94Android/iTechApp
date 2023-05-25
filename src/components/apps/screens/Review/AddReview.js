import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Image, } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import back from '../../../back/back';

import { AppContext } from '../../AppContext';
import { UserContext } from '../../../users/UserContext';

import ProgressDialog from 'react-native-progress-dialog';
import * as ImagePicker from 'react-native-image-picker';

const AddReview = (props) => {
  const { navigation } = props;
  const { item } = props.route.params;
  //console.log('Item on Add review screen: >>>>>>>>>>>>>>> ', item);
  back(navigation);

  const { onAddReview, onUploadPicture, onAddPicture, countOrderDetail, setCountOrderDetail } = useContext(AppContext);
  const { user } = useContext(UserContext);

  const [star, setStar] = useState(5);
  const [text, setText] = useState('');

  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  //Them review moi
  const handleSendCmt = async () => {
    setIsLoading(true);
    try {
      if (images.length == 0 && text == '') {
        setIsLoading(false);
        return;
      }
      //Lay ngay hien tai
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const dayNow = `${day}/${month}/${year}`;

      //Add review:   content, rating, idUser, idProduct
      const resReview = await onAddReview(dayNow, text, star, user._id, item.product._id);

      if (images.length != 0) {
        //Upload picture
        for (let i = 0; i < file.length; i++) {
          const formData = new FormData();
          formData.append('picture', {
            uri: file[i].uri,
            type: file[i].type,
            name: file[i].fileName,
          });
          const resPicture = await onUploadPicture(formData);
          if (resPicture.data == null || resPicture.data == undefined) {
            setIsLoading(false);
            return;
          }
          //Add picture:   url, idSubProduct, idReview
          await onAddPicture(resPicture.data, item.product._id, resReview.data._id);
          
        }
      }

      setCountOrderDetail(countOrderDetail + 1);
      navigation.goBack();
      setIsLoading(false);

    } catch (error) {
      console.log("Error send review: ", error);
    }
    setIsLoading(false);
  }

  //Xu ly chon anh
  const handleChoosePhoto = async () => {
    const options = {
      mediaType: 'photo',
      //includeBase64: false,
      //maxFiles: undefined,
      selectionLimit: 3, // Số lượng hình ảnh tối đa có thể chọn
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
        //console.log('selectedImages: ', response.assets);
        setImages(selectedImages);
        setFile(response.assets);
      }
    });
  };

  const handleRemoveImage = (uri) => {
    const newImages = images.filter((image) => image !== uri);
    setImages(newImages);
    const newFile = file.filter((file) => file.uri !== uri);
    setFile(newFile);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 12 }}>

      {/* top bar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{ width: 22, height: 22 }}
            resizeMode='cover'
            source={require('../../../../assets/images/back.png')} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
          <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>Add review</Text>
        </View>

        <View style={{ width: 22, height: 22 }}></View>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        {/* info product */}
        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
          <Image
            style={styles.imgProduct}
            resizeMode='cover'
            source={{ uri: item.product.image }} />
          <View>
            <Text numberOfLines={1} style={{ color: 'black', fontWeight: '800', fontSize: 20, marginStart: 8, width: 250 }}>{item.product.name}</Text>
            <Text numberOfLines={3} style={{ fontWeight: '200', fontSize: 14, marginStart: 8, width: 250, marginTop: 4 }}>{item.subProduct.screen}</Text>
          </View>

        </View>

        {/* Star */}
        <View>
          {
            star === 5 ?
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => setStar(1)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star.png')} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setStar(2)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStar(3)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStar(4)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStar(5)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star.png')} />
                </TouchableOpacity>
              </View> : <View></View>
          }

          {
            star === 4 ?
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => setStar(1)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star.png')} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setStar(2)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStar(3)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStar(4)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStar(5)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star2.png')} />
                </TouchableOpacity>
              </View> : <View></View>
          }

          {
            star === 3 ?
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => setStar(1)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star.png')} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setStar(2)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStar(3)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStar(4)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star2.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStar(5)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star2.png')} />
                </TouchableOpacity>
              </View> : <View></View>
          }

          {
            star === 2 ?
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => setStar(1)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star.png')} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setStar(2)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStar(3)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star2.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStar(4)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star2.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStar(5)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star2.png')} />
                </TouchableOpacity>
              </View> : <View></View>
          }

          {
            star === 1 ?
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => setStar(1)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star.png')} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setStar(2)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star2.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStar(3)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star2.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStar(4)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star2.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStar(5)}>
                  <Image
                    style={styles.star}
                    resizeMode='cover'
                    source={require('../../../../assets/images/star2.png')} />
                </TouchableOpacity>
              </View> : <View></View>
          }
        </View>

        {/* Cmt */}
        <View>
          <TextInput
            value={text}
            onChangeText={(text) => setText(text)}
            placeholder='Write a comment...'
            style={{ width: '100%', borderWidth: 1, borderColor: 'gray', borderRadius: 8, marginTop: 10, padding: 12 }}
            numberOfLines={3}
            multiline={true} />
        </View>

        {/* View image */}
        {images ? (
          <View style={{ flexDirection: 'row', marginVertical: 8, position: 'relative' }}>
            {images.map((uri, index) => (
              <View key={index} style={{ marginRight: 5 }}>
                <Image
                  style={{ width: 100, height: 100 }}
                  resizeMode='cover'
                  source={{ uri: uri }}
                />
                <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0 }} onPress={() => handleRemoveImage(uri)}>
                  <Image
                    style={{ width: 20, height: 20, }}
                    resizeMode='cover'
                    source={require('../../../../assets/images/del.png')}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View></View>
        )}

        <TouchableOpacity
          onPress={() => handleChoosePhoto()}
          style={{ height: 60, marginTop: 6, alignItems: 'center', flexDirection: 'row' }}>
          <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 5 }}>
            <Image
              style={{ width: 40, height: 40 }}
              resizeMode='cover'
              source={require('../../../../assets/images/ic_camera.png')} />
          </View>
          <Text style={{ fontSize: 14, marginTop: 5, color: '#ddd', fontWeight: '700', marginStart: 8 }}>Upload image</Text>
        </TouchableOpacity>

        {/* Upload image - send cmt */}
        <TouchableOpacity
          style={styles.btnSend}
          onPress={() => handleSendCmt()}>
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '800' }}>Send</Text>
        </TouchableOpacity>

      </ScrollView>

      <ProgressDialog
        visible={isLoading}
        title="Đang tải dữ liệu"
        message="Vui lòng đợi trong giây lát..." />

    </View>
  )
}

export default AddReview

const styles = StyleSheet.create({
  iconTopBar: {
    width: 24, height: 24,
  },
  textProfile: {
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
    fontWeight: '800',
  },
  imgProduct: {
    width: 80, height: 80,
    borderRadius: 8
  },
  star: {
    width: 24, height: 24,
    marginRight: 4,
  },
  btnSend: {
    justifyContent: 'center', alignItems: 'center',
    borderRadius: 30, backgroundColor: 'black',
    paddingVertical: 15, marginTop: 6,
    width: '100%', alignSelf: 'center'
  }
})