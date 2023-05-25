import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import back from '../../../back/back'
import { AppContext } from '../../AppContext'
import ProgressDialog from 'react-native-progress-dialog';

const ListReview = (props) => {
  const { navigation } = props
  const { productItem } = props.route.params;
  back(navigation);
  const { onGetReviews, onGetUsers } = useContext(AppContext);

  const [listReview, setListReview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getReviewsByIdProduct = async () => {
      setIsLoading(true);
      const resReviews = await onGetReviews();
      const resUser = await onGetUsers();
      const listUser = resUser.data;
      const reviews = resReviews.data;
      if (!reviews || !listUser){
        setIsLoading(false);
        return;
      } 
      //Loc ra danh sach review theo san pham sau do lay user tuong ung
      const reviewsByIdProduct = reviews.filter(review => review.idProduct === productItem._id);
      let numberReview = 0;
      for (let i = 0; i < reviewsByIdProduct.length; i++) {
        for (let j = 0; j < listUser.length; j++) {
          if (reviewsByIdProduct[i].idUser === listUser[j]._id) {
            reviewsByIdProduct[i].user = listUser[j];
            numberReview += 1;
            break;
          }
        }
      }
      productItem.numberReview = numberReview;
      setListReview(reviewsByIdProduct);
      setIsLoading(false);
    };
    getReviewsByIdProduct();
  }, []);

  //Lay danh sach review theo san pham

  return (
    <View style={styleReview.container}>

      <ProgressDialog
        visible={isLoading}
        loaderColor='black'
        lable="Please wait..." />

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

        <View style={{ width: 22, height: 22 }} />
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
              <Text>{productItem.name}</Text>
              <View style={styleReview.Star}>
                <Image
                  style={styleReview.icStar}
                  source={require('../../../../assets/images/star.png')}
                ></Image>
                <Text style={styleReview.txtStar}>{productItem.rating}</Text>
              </View>
              <Text>{productItem.numberReview} Reviews</Text>
            </View>
          </View>

          <View style={styleReview.AllReview}>
            {
              listReview.map((review, index) => {
                return (
                  <Item review={review} key={index} />
                )
              })
            }
          </View>

        </View>
      </ScrollView>

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
    marginLeft: 130, 
    borderRadius: 50
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
});

const Item = ({review}) => {
  return (
    <View style={styleReview.BoxReview}>
      <Image
        style={styleReview.icAva}
        source={{ uri: review.user.avatar }}
      />

      <View style={styleReview.RName}>
        <Text>{review.user.name}</Text>
        <Text>{review.time}</Text>
      </View>
      {
        review.rating === 1 &&
        <View style={styleReview.RatingStar}>
          <Image
            style={styleReview.icStar01}
            source={require('../../../../assets/images/star.png')}
          />
        </View>
      }
      {
        review.rating === 2 &&
        <View style={styleReview.RatingStar}>
          <Image
            style={styleReview.icStar01}
            source={require('../../../../assets/images/star.png')}
          />
          <Image
            style={styleReview.icStar01}
            source={require('../../../../assets/images/star.png')}
          />
        </View>
      }
      {
        review.rating === 3 &&
        <View style={styleReview.RatingStar}>
          <Image
            style={styleReview.icStar01}
            source={require('../../../../assets/images/star.png')}
          />
          <Image
            style={styleReview.icStar01}
            source={require('../../../../assets/images/star.png')}
          />
          <Image
            style={styleReview.icStar01}
            source={require('../../../../assets/images/star.png')}
          />
        </View>
      }
      {
        review.rating === 4 &&
        <View style={styleReview.RatingStar}>
          <Image
            style={styleReview.icStar01}
            source={require('../../../../assets/images/star.png')}
          />
          <Image
            style={styleReview.icStar01}
            source={require('../../../../assets/images/star.png')}
          />
          <Image
            style={styleReview.icStar01}
            source={require('../../../../assets/images/star.png')}
          />
          <Image
            style={styleReview.icStar01}
            source={require('../../../../assets/images/star.png')}
          />
        </View>
      }
      {
        review.rating === 5 &&
        <View style={styleReview.RatingStar}>
          <Image
            style={styleReview.icStar01}
            source={require('../../../../assets/images/star.png')}
          />
          <Image
            style={styleReview.icStar01}
            source={require('../../../../assets/images/star.png')}
          />
          <Image
            style={styleReview.icStar01}
            source={require('../../../../assets/images/star.png')}
          />
          <Image
            style={styleReview.icStar01}
            source={require('../../../../assets/images/star.png')}
          />
          <Image
            style={styleReview.icStar01}
            source={require('../../../../assets/images/star.png')}
          />
        </View>
      }


      <View style={styleReview.comment}>
        <Text>{review.content}</Text>
      </View>
    </View>
  )
}