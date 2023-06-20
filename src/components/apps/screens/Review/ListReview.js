import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
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

  const [numberReview1, setNumberReview1] = useState(0);
  const [numberReview2, setNumberReview2] = useState(0);
  const [numberReview3, setNumberReview3] = useState(0);
  const [numberReview4, setNumberReview4] = useState(0);
  const [numberReview5, setNumberReview5] = useState(0);

  let reviewsRef = useRef([]);

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
      reviewsRef.current = reviewsByIdProduct;
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
      getNumberReviewByStar(reviewsByIdProduct);
      setIsLoading(false);
    };
    getReviewsByIdProduct();
  }, []);

  //Lay danh sach review theo so sao
  const getReviewByStar = (star) => {
    let list = [];
    if (star === 1) {
      list = reviewsRef.current.filter(review => review.rating === 1);
    }
    if (star === 2) {
      list = reviewsRef.current.filter(review => review.rating === 2);
    }
    if (star === 3) {
      list = reviewsRef.current.filter(review => review.rating === 3);
    }
    if (star === 4) {
      list = reviewsRef.current.filter(review => review.rating === 4);
    }
    if (star === 5) {
      list = reviewsRef.current.filter(review => review.rating === 5);
    }
    setListReview(list);
  }

  //Lay tat ca danh sach review
  const getAllReview = () => {
    setListReview(reviewsRef.current);
  }

  const getNumberReviewByStar = (listReview) => {
    let numberReview1 = 0;
    let numberReview2 = 0;
    let numberReview3 = 0;
    let numberReview4 = 0;
    let numberReview5 = 0;
    for (let i = 0; i < listReview.length; i++) {
      if (listReview[i].rating === 1) {
        numberReview1 += 1;
      }
      if (listReview[i].rating === 2) {
        numberReview2 += 1;
      }
      if (listReview[i].rating === 3) {
        numberReview3 += 1;
      }
      if (listReview[i].rating === 4) {
        numberReview4 += 1;
      }
      if (listReview[i].rating === 5) {
        numberReview5 += 1;
      }
    }

    setNumberReview1(numberReview1);
    setNumberReview2(numberReview2);
    setNumberReview3(numberReview3);
    setNumberReview4(numberReview4);
    setNumberReview5(numberReview5);

  }

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
              <Text
                numberOfLines={1}
                maxWidth={180}
                style={{ fontWeight: '800', fontSize: 18, color: 'black', marginBottom: 2 }}>
                {productItem.name}
              </Text>
              <TouchableOpacity onPress={() => getAllReview()}>
                <View style={[styleReview.Star, { marginBottom: 2 }]}>
                  <Image
                    style={styleReview.icStar}
                    source={require('../../../../assets/images/star.png')}
                  ></Image>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>{productItem.rating} / {productItem.numberReview} Reviews</Text>
                </View>
              </TouchableOpacity>
              {/* 5 sao */}
              <TouchableOpacity onPress={() => getReviewByStar(5)}>
                <View style={[styleReview.Star]}>
                  <Image
                    style={styleReview.icStar2}
                    source={require('../../../../assets/images/star.png')}
                  ></Image>
                  <Image
                    style={styleReview.icStar2}
                    source={require('../../../../assets/images/star.png')}
                  ></Image>
                  <Image
                    style={styleReview.icStar2}
                    source={require('../../../../assets/images/star.png')}
                  ></Image>
                  <Image
                    style={styleReview.icStar2}
                    source={require('../../../../assets/images/star.png')}
                  ></Image>
                  <Image
                    style={styleReview.icStar2}
                    source={require('../../../../assets/images/star.png')}
                  ></Image>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>({numberReview5})</Text>
                </View>
              </TouchableOpacity>

              {/* 4 sao */}
              <TouchableOpacity onPress={() => getReviewByStar(4)}>
                <View style={[styleReview.Star]}>
                  <Image
                    style={styleReview.icStar2}
                    source={require('../../../../assets/images/star.png')}
                  ></Image>
                  <Image
                    style={styleReview.icStar2}
                    source={require('../../../../assets/images/star.png')}
                  ></Image>
                  <Image
                    style={styleReview.icStar2}
                    source={require('../../../../assets/images/star.png')}
                  ></Image>
                  <Image
                    style={styleReview.icStar2}
                    source={require('../../../../assets/images/star.png')}
                  ></Image>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>({numberReview4})</Text>
                </View>
              </TouchableOpacity>

              {/* 3 sao */}
              <TouchableOpacity onPress={() => getReviewByStar(3)}>
                <View style={[styleReview.Star]}>
                  <Image
                    style={styleReview.icStar2}
                    source={require('../../../../assets/images/star.png')}
                  ></Image>
                  <Image
                    style={styleReview.icStar2}
                    source={require('../../../../assets/images/star.png')}
                  ></Image>
                  <Image
                    style={styleReview.icStar2}
                    source={require('../../../../assets/images/star.png')}
                  ></Image>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>({numberReview3})</Text>
                </View>
              </TouchableOpacity>

              {/* 2 sao */}
              <TouchableOpacity onPress={() => getReviewByStar(2)}>
                <View style={[styleReview.Star]}>
                  <Image
                    style={styleReview.icStar2}
                    source={require('../../../../assets/images/star.png')}
                  ></Image>
                  <Image
                    style={styleReview.icStar2}
                    source={require('../../../../assets/images/star.png')}
                  ></Image>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>({numberReview2})</Text>
                </View>
              </TouchableOpacity>

              {/* 1 sao */}
              <TouchableOpacity onPress={() => getReviewByStar(1)}>
                <View style={[styleReview.Star]}>
                  <Image
                    style={styleReview.icStar2}
                    source={require('../../../../assets/images/star.png')}
                  ></Image>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>({numberReview1})</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>



          <View style={{marginTop: 12}}>
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
    width: 150,
    height: 150,
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd'
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
    width: 18,
    height: 18
  },

  icStar2: {
    width: 12,
    height: 12
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
    shadowOffset: { width: -2, height: 4 },
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
  //console.log(review.pictures[0].url);
  return (
    <View style={styleReview.BoxReview}>


      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontWeight: '800', fontSize: 16, color: 'black' }}>{review.user.name}</Text>
        <Text style={{ fontWeight: '600', fontSize: 16, color: 'black' }}>{review.time}</Text>
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

      <View style={{ flexDirection: 'row', maxWidth: '90%', marginTop: 8 }}>
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



      <View style={{ marginTop: 8 }}>
        <Text style={{ fontWeight: '600', fontSize: 14, }}>{review.content}</Text>
      </View>


      <Image
        style={styleReview.icAva}
        source={{ uri: review.user.avatar }}
      />
    </View>
  )
}