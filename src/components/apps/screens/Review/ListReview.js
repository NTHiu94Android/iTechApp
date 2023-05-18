import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import back from '../../../back/back'

const ListReview = (props) => {
  const { navigation } = props
  back(navigation);
  return (
    <View style={styleReview.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{ width: 22, height: 22 }}
            resizeMode='cover'
            source={require('../../../../assets/images/back.png')} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
          <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>Rating & review</Text>

        </View>

        <View style={{width: 22, height: 22}}/>
      </View>

      <ScrollView showsVertic alScrollIndicator={false}>
        <View style={styleReview.body}>
          <View style={styleReview.header}>
            <View>
              <Image
                style={styleReview.icImg}
                source={require('../../../../assets/images/s23.jpg')}
              ></Image>
            </View>
            <View style={styleReview.txtheader}>
              <Text>SamSung S23 Utral</Text>
              <View style={styleReview.Star}>
                <Image
                  style={styleReview.icStar}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
                <Text style={styleReview.txtStar}>4.5</Text>
              </View>
              <Text>10 Reviews</Text>
            </View>
          </View>

          <View style={styleReview.AllReview}>

            {/* 1 */}
            <View style={styleReview.BoxReview}>
              <Image
                style={styleReview.icAva}
                source={require('../../../../assets/images/avataruser.png')}
              ></Image>

              <View style={styleReview.RName}>
                <Text>Bruno Fernandes</Text>
                <Text>20/02/2020</Text>
              </View>
              <View style={styleReview.RatingStar}>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
              </View>

              <View style={styleReview.comment}>
                <Text>Máy tốt sang xịn mịn, đập không nát, chọi không banh, đánh giá ngàn sao.</Text>
              </View>
            </View>

            {/* 2 */}
            <View style={styleReview.BoxReview}>
              <Image
                style={styleReview.icAva}
                source={require('../../../../assets/images/avataruser.png')}
              ></Image>

              <View style={styleReview.RName}>
                <Text>Bruno Fernandes</Text>
                <Text>20/02/2020</Text>
              </View>
              <View style={styleReview.RatingStar}>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
              </View>

              <View style={styleReview.comment}>
                <Text>Máy tốt sang xịn mịn, đập không nát, chọi không banh, đánh giá ngàn sao.</Text>
              </View>
            </View>

            {/* 3 */}
            <View style={styleReview.BoxReview}>
              <Image
                style={styleReview.icAva}
                source={require('../../../../assets/images/avataruser.png')}
              ></Image>

              <View style={styleReview.RName}>
                <Text>Bruno Fernandes</Text>
                <Text>20/02/2020</Text>
              </View>
              <View style={styleReview.RatingStar}>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
              </View>

              <View style={styleReview.comment}>
                <Text>Máy tốt sang xịn mịn, đập không nát, chọi không banh, đánh giá ngàn sao.</Text>
              </View>
            </View>

            {/* 4 */}
            <View style={styleReview.BoxReview}>
              <Image
                style={styleReview.icAva}
                source={require('../../../../assets/images/avataruser.png')}
              ></Image>

              <View style={styleReview.RName}>
                <Text>Bruno Fernandes</Text>
                <Text>20/02/2020</Text>
              </View>
              <View style={styleReview.RatingStar}>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
                <Image
                  style={styleReview.icStar01}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
              </View>

              <View style={styleReview.comment}>
                <Text>Máy tốt sang xịn mịn, đập không nát, chọi không banh, đánh giá ngàn sao.</Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
      {/* WRITE A REVIEW */}
      <View style={styleReview.btn}>
        <TouchableOpacity onPress={() => navigation.navigate('AddReview')}>
          <Text style={styleReview.btnText}>Write a Review</Text>
        </TouchableOpacity>
      </View>
    </View>

  )
}

export default ListReview

const styleReview = StyleSheet.create({
  // container
  container: {
    display: 'flex',
    backgroundColor: 'white',
    width: '100%',
    height: '100%'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20
  },

  icBack: {
    width: 20,
    height: 20,
  },

  DetailTxt: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    width: '70%'
  },

  //body
  body: {
    height: '100%',
    width: '100%'
  },

  icImg: {
    width: 100,
    height: 100,
    borderRadius: 10
  },

  txtheader: {
    width: '70%'
  },

  //Star Point
  Star: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icStar: {
    width: 30,
    height: 30
  },

  txtStar: {
    fontSize: 20,
    paddingLeft: 10
  },

  //Review
  BoxReview: {
    width: '90%',
    height: 160,
    marginLeft: 20,
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    justifyContent: 'center'
  },

  icAva: {
    width: 50,
    height: 50,
    bottom: 40,
    marginLeft: 130
  },

  RName: {
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  RatingStar: {
    bottom: 25,
    flexDirection: 'row'
  },

  icStar01: {
    width: 20,
    height: 20
  },

  //Comment
  comment: {
    bottom: 15,
  },

  //Button
  btn: {
    backgroundColor: 'black',
    width: '90%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 30,
  },

  btnText: {
    color: 'white',
    fontSize: 20
  },
})