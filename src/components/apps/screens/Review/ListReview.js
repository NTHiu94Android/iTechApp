import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import back from '../../../back/back'
import { AppContext } from '../../AppContext'
import ProgressDialog from 'react-native-progress-dialog';

const ListReview = (props) => {
  const { navigation } = props
  const { productItem } = props.route.params;
  back(navigation);
  const { onGetReviews, onGetUsers, onGetPicturesByIdReview } = useContext(AppContext);

  const [listReview, setListReview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getReviewsByIdProduct = async () => {
      setIsLoading(true);
      const resReviews = await onGetReviews();
      const resUser = await onGetUsers();
      const listUser = resUser.data;
      const reviews = resReviews.data;
      if (!reviews || !listUser) {
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
        const listPicture = await onGetPicturesByIdReview(reviewsByIdProduct[i]._id);
        reviewsByIdProduct[i].pictures = listPicture;

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
                source={{ uri: productItem.image }}
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
    marginLeft: 20,
    marginTop: 30,
    marginBottom: 5,
    padding: 20,
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: 'grey',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: 10,
    justifyContent: 'center',
    position: 'relative'
  },

  icAva: {
    width: 50,
    height: 50,
    top: -25,
    left: '50%',
    borderRadius: 50, position: 'absolute',
  },

  RName: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  RatingStar: {
    flexDirection: 'row'
  },

  icStar01: {
    width: 20,
    height: 20
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
    fontSize: 20,
  },
});

const Item = ({ review }) => {
  return (
    <View style={styleReview.BoxReview}>
      

      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
        <Text style={{fontWeight: '800', fontSize: 16, color: 'black'}}>{review.user.name}</Text>
        <Text style={{fontWeight: '600', fontSize: 16, color: 'black'}}>{review.time}</Text>
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

      <View style={{flexDirection: 'row', maxWidth: '90%', marginTop: 8 }}>
        {
          review.pictures.map((item, index) => {
            return (
              <Image
                style={{ width: 100, height: 100, borderRadius: 10, marginRight: 5, marginVertical: 5 }}
                source={{ uri: item.url }}
                key={index}
              />
            )
          })
        }
      </View>



      <View style={{marginTop: 8}}>
        <Text style={{fontWeight: '600', fontSize: 14, }}>{review.content}</Text>
      </View>


      <Image
        style={styleReview.icAva}
        source={{ uri: review.user.avatar }}
      />
    </View>
  )
}