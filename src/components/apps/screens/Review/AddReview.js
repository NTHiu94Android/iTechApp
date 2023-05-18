import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Image, } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import back from '../../../back/back';

import { AppContext } from '../../AppContext';
import { UserContext } from '../../../users/UserContext';

import ProgressDialog from 'react-native-progress-dialog';

const AddReview = (props) => {
  const { navigation } = props;
  back(navigation);

  const { } = useContext(AppContext);
  const { user } = useContext(UserContext);

  const [star, setStar] = useState(5);
  const [text, setText] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSendCmt = async () => {
    setIsLoading(true);
    //Xu ly gui comment
    navigation.goBack();
    setIsLoading(false);
  };

  const handleChoosePhoto = () => {
    //Xu ly chon anh

  }

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
            source={{ uri: 'https://www.xtmobile.vn/vnt_upload/product/02_2022/thumbs/(600x600)_crop_samsung-galaxy-s22-plus-chinh-hang.jpg' }} />
          <View>
            <Text numberOfLines={1} style={{ color: 'black', fontWeight: '800', fontSize: 20, marginStart: 8, width: 250 }}>Samsung s22 Ultra</Text>
            <Text numberOfLines={3} style={{ fontWeight: '200', fontSize: 14, marginStart: 8, width: 250, marginTop: 4 }}>Description</Text>
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

        <TouchableOpacity
          onPress={() => handleChoosePhoto()}
          style={{  height: 60, marginTop: 6, alignItems: 'center', flexDirection: 'row'}}>
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