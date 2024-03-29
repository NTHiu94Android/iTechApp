import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ToastAndroid, useWindowDimensions, TextInput } from 'react-native'
import React, { useState, useContext, useEffect, useRef } from 'react'
import { AppContext } from '../../AppContext';

import { UserContext } from '../../../users/UserContext';

//import { Table, Row, Rows } from 'react-native-table-component';
import RenderHtml from 'react-native-render-html';
import Swiper from 'react-native-swiper';
import ProgressDialog from 'react-native-progress-dialog';
import back from '../../../back/back';
import DialogChangCount from '../Dialog/DialogChangCount';


const ProductDetail = ({ route, navigation }) => {
  const { idProduct, idSubProduct } = route.params;
  const { width } = useWindowDimensions();
  back(navigation);
  const {
    //Picture
    onGetPicturesByIdProduct,
    //Order detail
    onAddOrderDetail, onGetOrderDetailByIdOrder,
    //Product
    onGetProductById,
    //Review
    onGetReviews,
    //Sub product
    onGetSubProducts,
  } = useContext(AppContext);
  const { user } = useContext(UserContext);
  const [count, setCount] = useState(1);
  const [listImage, setListImage] = useState([]);
  const [listColor, setListCorlor] = useState([]);
  const [itemSelected, setItemSelected] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const [isShowDialog, setIsShowDialog] = useState(false);

  const [productItem, setProductItem] = useState({});

  const resSubProductRef = useRef({});

  const source = {
    html: `${itemSelected.description}`
  }

  // const tableHead = ['Parameter', 'Value'];
  // const [tableData, setTableData] = useState(
  //   [
  //     ['1', '2'],
  //     ['a', 'b']
  //   ]
  // );

  //Lay tat ca hinh anh cua san pham va mau sac , binh luan
  useEffect(() => {
    //Lay danh sach mau
    const getData = async () => {
      try {
        if (isFirstRun) {
          setIsFirstRun(false);
          setIsLoading(false);
        }
        let colors = [];
        const product = await onGetProductById(idProduct);
        const resReview = await onGetReviews();
        const resSubProduct = await onGetSubProducts();
        resSubProductRef.current = resSubProduct;
        //Them danh sach subProduct va rating vao product 
        product.subProduct = await onGetSubProductsByIdProduct(idProduct, resSubProduct);
        product.rating = await getStar(idProduct, resReview);
        //Set product
        setProductItem(product);
        //Lay danh sach mau
        if (idSubProduct) {
          for (let i = 0; i < product.subProduct.length; i++) {
            colors.push(product.subProduct[i].color);
            if (product.subProduct[i]._id === idSubProduct) {
              setItemSelected(product.subProduct[i]);
              checkFavorite(product.subProduct[i]._id);
              getImagesProduct(product.subProduct[i]._id);

            }
          }
          setListCorlor(colors);
        } else {
          for (let i = 0; i < product.subProduct.length; i++) {
            colors.push(product.subProduct[i].color);
          }
          //Set mau mac dinh, lay hinh anh mac dinh, lay thong tin mac dinh, kiem tra yeu thich
          setItemSelected(product.subProduct[0]);
          checkFavorite(product.subProduct[0]._id);
          setListCorlor(colors);
          getImagesProduct(product.subProduct[0]._id);
        }


        // setTableData([
        //   ['CPU', product.subProduct[0].cpu],
        //   ['Ram', product.subProduct[0].ram],
        //   ['Rom', product.subProduct[0].rom],
        //   ['Screen', product.subProduct[0].screen],
        //   ['Pin', product.subProduct[0].pin],
        //   ['Camera', product.subProduct[0].fontCamera],
        // ]);
        setIsLoading(true);
      } catch (error) {
        setIsLoading(true);
        console.log("Get list color error: ", error);
      }
    };
    getData();
  }, []);

  //Xu ly thay doi so luong san pham them vao cart
  const handleCountPlus = () => {
    const max = itemSelected.quantity;
    if (count <= max)
      setCount(count + 1);
  };
  const handleCountMinus = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  const handleCountChange = (value) => {
    setCount(value);
    setIsShowDialog(false);
  };

  //Lay danh sach subProduct theo idProduct
  const onGetSubProductsByIdProduct = async (idProduct, res) => {
    try {

      if (res == null || res == undefined) {
        return;
      } else {
        const subProduct = res.data.filter((item) => item.idProduct == idProduct);
        return subProduct;
      }
    } catch (error) {
      console.log('onGetSubProductsByIdProduct error: ', error);
    }
  };

  //Lay sao tu danh gia set vao tung item
  const getStar = async (idProduct, res) => {
    let star = 0;
    let count = 0;

    if (res == null || res == undefined) {
      return 0;
    }
    const review = res.data;
    for (let i = 0; i < review.length; i++) {
      if (review[i].idProduct == idProduct) {
        count = count + 1;
        star += review[i].rating;
      }
    }
    if (count == 0) {
      return 0;
    } else {
      return (star / count).toFixed(1);
    }
  };

  //Kiem tra san pham da co trong danh sach yeu thich chua
  const checkFavorite = async (idSubProduct) => {
    let check = false;
    const resFavorite = await onGetOrderDetailByIdOrder(user.idFavorite);
    const listFavorite = resFavorite.data;
    listFavorite.find((item) => {
      if (item.idSubProduct === idSubProduct) {
        check = true;
      }
    });
    setIsFavorite(check);
  };

  //Lay anh theo mau
  const getImageByColor = async (color) => {
    try {
      const subProduct = await onGetSubProductsByIdProduct(idProduct, resSubProductRef.current);
      for (let i = 0; i < subProduct.length; i++) {
        if (subProduct[i].color == color) {
          getImagesProduct(subProduct[i]._id);
          setItemSelected(subProduct[i]);
          checkFavorite(subProduct[i]._id);
        }
      }
    } catch (error) {
      console.log("Get image by color error: ", error);
    }
  };

  const getImagesProduct = async (idSubProduct) => {
    try {
      const res = await onGetPicturesByIdProduct(idSubProduct);
      if (res != undefined || res.data != undefined) {
        const images = res.data;
        let list = [];
        for (let i = 0; i < images.length; i++) {
          list.push(images[i].url);
        }
        setListImage(list);
      }
    } catch (error) {
      console.log("Error getImages product: ", error);
    }
  }

  //Them/xoa san pham vao gio hang / yeu thich
  const addOrderDatail = async (number, name) => {
    try {
      let idOrder = '';
      name == 'Cart' ? idOrder = user.idCart : idOrder = user.idFavorite;
      if (name == 'Favorite') {
        setIsFavorite(!isFavorite);
      } else {
        ToastAndroid.show("The product has been added to cart", ToastAndroid.SHORT);
      }
      let price = 0;
      itemSelected.sale > 0 ? price = itemSelected.price - itemSelected.price * itemSelected.sale / 100 : price = itemSelected.price;
      const res = await onAddOrderDetail(number, price, idOrder, itemSelected._id);
      // if (res == true) {
      //   if (name == 'Cart') {
      //     navigation.navigate(name);
      //   } else {
      //     console.log("San pham da duoc them vao danh sach yeu thich");
      //     setIsFavorite(true);
      //     //navigation.navigate(name);
      //     //ToastAndroid.show("Sản phẩm đã được thêm vào danh sách yêu thích", ToastAndroid.SHORT);
      //   }
      // } else {
      //   if (name == 'Favorite') {
      //     //Delete khoi ds yeu thich
      //     setIsFavorite(false);
      //   } else { //Cart
      //     //navigation.navigate(name);
      //     //ToastAndroid.show("Sản phẩm đã có trong giỏ hàng", ToastAndroid.SHORT);
      //   }
      // }
    } catch (error) {
      console.log("Add order detail error: ", error);
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>

      {
        isShowDialog ?
          <DialogChangCount
            handleCountChange={handleCountChange}
            isVisible={isShowDialog}
            max={itemSelected.quantity}
          /> : null
      }

      <ScrollView style={{ flex: 1, position: 'relative', marginBottom: 80 }}>

        {/* Box product - slide */}
        <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center', height: 280 }}>
          {
            isLoading ?
              <Swiper
                style={{ height: 280 }}
                autoplayTimeout={3}
                autoplay={true}
                loop={true}
                showsPagination={true}>
                {listImage.map((image, index) => {
                  return (
                    <Image
                      key={index}
                      style={{ width: '100%', height: 280 }}
                      resizeMode='stretch'
                      source={{
                        uri: image,
                      }} />
                  )
                })}
              </Swiper> : null
          }


          <View style={{ position: "absolute", top: 20, left: 10 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                resizeMode='cover'
                source={require('../../../../assets/images/ic_back.png')}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Box color */}
        <View style={{ flexDirection: 'row', marginStart: 8, marginTop: 8 }}>
          {
            listColor.length > 0 ? listColor.map((color, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={itemSelected.color === color ? styles.boxColorSelected : styles.boxColor}
                  onPress={() => getImageByColor(color)}>
                  <View style={{ backgroundColor: color, width: 40, height: 40, borderRadius: 5 }}></View>
                </TouchableOpacity>
              )
            }) : null

          }
        </View>

        {/* Box information */}
        <View style={{ flex: 6, paddingHorizontal: 12 }}>
          {/* Name product */}
          <Text style={{ color: 'black', fontWeight: '800', fontSize: 24, marginTop: 16, lineHeight: 30.47 }}>{productItem.name}</Text>

          {/* View price - plus */}
          {
            itemSelected.sale == 0 ?
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: 'black', fontWeight: '700', fontSize: 30, marginTop: 6, flex: 3 }}>
                  $ {itemSelected.price}
                </Text>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', marginHorizontal: 20, marginTop: 10, flex: 1 }}>
                    <TouchableOpacity style={{}} onPress={() => handleCountMinus()}>
                      <Image
                        style={{ width: 25, height: 25 }}
                        source={require('../../../../assets/images/btn_minus.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{}} onPress={() => setIsShowDialog(true)}>
                      <View style={{ width: 25, height: 25, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{}}>{count}</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleCountPlus()}>
                      <Image
                        style={{ width: 25, height: 25 }}
                        source={require('../../../../assets/images/btn_plus.png')}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={{ color: 'black', fontWeight: '700', fontSize: 14, marginTop: 6 }}>(${itemSelected.quantity} products in stock)</Text>
                </View>
              </View> :
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: 'red', fontWeight: '700', fontSize: 30, marginTop: 6, flex: 3 }}>
                    $ {itemSelected.price - (itemSelected.price * itemSelected.sale / 100)}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', padding: 8, width: 60, borderRadius: 8, marginEnd: 8 }}>
                      <Text style={{ color: 'white', fontWeight: '800', fontSize: 13 }}>-{itemSelected.sale}%</Text>
                    </View>
                    <Text style={{ color: 'black', fontWeight: '700', fontSize: 20, marginTop: 6, flex: 3, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                      $ {itemSelected.price}
                    </Text>
                  </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', marginHorizontal: 20, marginTop: 10 }}>
                    <TouchableOpacity style={{}} onPress={() => handleCountMinus()}>
                      <Image
                        style={{ width: 25, height: 25 }}
                        source={require('../../../../assets/images/btn_minus.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setIsShowDialog(true)}>
                      <View style={{ width: 25, height: 25, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{}}>{count}</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleCountPlus()}>
                      <Image
                        style={{ width: 25, height: 25 }}
                        source={require('../../../../assets/images/btn_plus.png')}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={{ color: 'black', fontWeight: '700', fontSize: 14, marginTop: 6 }}>(${itemSelected.quantity} products in stock)</Text>
                </View>
              </View>

          }

          {/* View rate */}
          <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../../../../assets/images/ic_star.png')}
            />
            <Text style={{ color: 'black', fontWeight: '700', fontSize: 18, marginStart: 4 }}>
              {productItem.rating}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('ListReview', { productItem })}>
              <Text style={{ color: '#808080', fontWeight: '600', fontSize: 14, marginLeft: 10, textDecorationLine: 'underline' }}>
                See all reviews
              </Text>
            </TouchableOpacity>
          </View>

          {/* View table */}
          {/* <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Text style={{ color: 'black', fontWeight: '700', fontSize: 18, marginTop: 14, marginBottom: 8 }}>Product information</Text>
            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
              <Row data={tableHead} style={styles.head} textStyle={styles.text} />
              <Rows data={tableData} textStyle={styles.text} />
            </Table>
          </View> */}

          {/* View description */}
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ color: 'black', fontWeight: '700', marginTop: 14, fontSize: 18 }}>Description</Text>
            {
              source.html == '' ?
                <Text>Description</Text> :
                <RenderHtml
                  contentWidth={width}
                  source={source}
                />
            }

          </View>

        </View>


      </ScrollView >


      {/* Box favorite + add to cart (absolute) */}
      <View style={styles.viewButton}>
        <View style={{ marginRight: 15 }}>
          {
            isFavorite ?
              <TouchableOpacity onPress={() => addOrderDatail(1, 'Favorite')} style={styles.button1}>
                <Image style={{ width: 24, height: 24 }}
                  source={require('../../../../assets/images/ic_heart512_2.png')} />
              </TouchableOpacity> :
              <TouchableOpacity onPress={() => addOrderDatail(1, 'Favorite')} style={styles.button1}>
                <Image style={{ width: 24, height: 24 }}
                  source={require('../../../../assets/images/ic_heart512.png')} />
              </TouchableOpacity>
          }

        </View>
        <View style={{}}>
          {
            itemSelected.quantity == 0 ?
              <View style={[styles.button2, {backgroundColor: '#ddd'}]}>
                <Text style={{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>
                  Temporarily out of stock</Text>
              </View> :
              <TouchableOpacity onPress={() => addOrderDatail(count, 'Cart')} style={styles.button2}>
                <Text style={{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>
                  Add to cart</Text>
              </TouchableOpacity>
          }
          {/* <TouchableOpacity onPress={() => addOrderDatail(count, 'Cart')} style={styles.button2}>
            <Text style={{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>
              Add to cart</Text>
          </TouchableOpacity> */}
        </View>
      </View>

      <ProgressDialog
        visible={!isLoading}
        loaderColor='black'
        lable="Please wait..." />
    </View>
  )

}


export default ProductDetail

const styles = StyleSheet.create({
  viewButton: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 10,
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  button2: {
    backgroundColor: '#000', height: 50, width: 280,
    borderRadius: 30, flexDirection: 'column', justifyContent: 'center'
  },
  button1: {
    backgroundColor: '#F0F0F0', height: 50, width: 50,
    borderRadius: 30, justifyContent: 'center', alignItems: 'center'
  },
  boxColorSelected: {
    width: 50,
    height: 50,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  boxColor: {
    width: 50,
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 }
})