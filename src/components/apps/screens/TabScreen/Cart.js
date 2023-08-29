import { FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View, alert, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../AppContext';
import { UserContext } from '../../../users/UserContext';

import ProgressDialog from 'react-native-progress-dialog';

const Cart = (props) => {
  const { navigation } = props;
  const { user } = useContext(UserContext);

  const {
    onGetOrderDetailByIdOrder, listCart, setListCart,
    //Count
    countCart, setCountCart, setNumberCart,
    //Sub product
    onGetSubProducts,
    //Product
    onGetProducts,
    //Review 
    onGetReviews,
    //Order detail
    onUpdateOrderDetail, onDeleteOrderDetail,
    objRef,
  } = useContext(AppContext);

  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstRun, setIsFirstRun] = useState(true);

  const [listPrd, setListPrd] = useState([]);

  const [listSelected, setListSelected] = useState([]);



  //Lay danh sach san pham trong gio hang
  useEffect(() => {
    const getListCart = async () => {
      try {
        if (isFirstRun) {
          setIsLoading(true);
          setIsFirstRun(false);
        }
        // const resProduct = await onGetProducts();
        // const resSubProduct = await onGetSubProducts();
        // const resReview = await onGetReviews();

        const resProduct = objRef.current.listProducts;
        const resSubProduct = objRef.current.listSubProducts;
        const resReview = objRef.current.listReviews;

        const listProduct = resProduct.data;
        const response = await onGetOrderDetailByIdOrder(user.idCart);
        if (response.data == undefined) {
          setListCart([]);
          setIsLoading(false);
          return;
        }
        const data = response.data;
        let sum = 0;
        let numberCart = 0;
        //console.log("List cart: ", response);
        for (let i = 0; i < data.length; i++) {
          const subProduct = resSubProduct.data.find((item) => item._id === data[i].idSubProduct);
          const product = listProduct.find(item => item._id === subProduct.idProduct);
          data[i].idSubProduct = subProduct._id;
          data[i].imageurl = product.image;
          data[i].prodName = product.name;
          data[i].color = subProduct.color;
          if (subProduct.sale == 0) {
            data[i].price = subProduct.price;
          } else {
            data[i].price = subProduct.price - (subProduct.price * subProduct.sale / 100);
          }
          data[i].priceNoSale = subProduct.price;
          data[i].totalPriceNoSale = subProduct.price * data[i].quantity;
          //await onUpdateOrderDetail(data[i]._id, data[i].quantity, data[i].price, false, data[i].idOrder, data[i].idSubProduct);
          data[i].totalPrice = data[i].price * data[i].quantity;
          data[i].amount = data[i].quantity;
          data[i].subProduct = subProduct;
          data[i].product = product;

          data[i].isSelect = true;

          if (data[i].isSelect) {
            sum += data[i].totalPrice;
          }
          numberCart += data[i].quantity;
        }
        console.log('Number cart: ', numberCart);
        setNumberCart(numberCart);
        setListSelected(data);
        setListCart(data);
        setTotal(sum);

        //Lay danh sach san pham lien quan
        let listIdCategory = [];
        for (let i = 0; i < data.length; i++) {
          let check = false;
          for (let j = 0; j < listIdCategory.length; j++) {
            if (data[i].product.idCategory == listIdCategory[j]) {
              check = true;
              break;
            }
          }
          if (check == false) {
            listIdCategory.push(data[i].product.idCategory);
          }
        };

        let list1 = [];
        for (let i = 0; i < listProduct.length; i++) {
          if (listIdCategory.length == 0) {
            if (i < 10) {
              const star = await getStar(listProduct[i]._id, resReview);
              const subProduct = await onGetSubProductsByIdProduct(listProduct[i]._id, resSubProduct);
              listProduct[i].rating = star;
              listProduct[i].subProduct = subProduct;
              list1.push(listProduct[i]);
            }
          } else {
            let check = false;
            for (let j = 0; j < listIdCategory.length; j++) {
              if (listProduct[i].idCategory == listIdCategory[j]) {
                check = true;
                break;
              }
            }
            if (check) {
              if (list1.length < 10) {
                const star = await getStar(listProduct[i]._id, resReview);
                const subProduct = await onGetSubProductsByIdProduct(listProduct[i]._id, resSubProduct);
                listProduct[i].rating = star;
                listProduct[i].subProduct = subProduct;
                list1.push(listProduct[i]);
              }

            }
          }

        }
        setListPrd(list1);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log("Get list cart error: ", error);
      }
    };
    getListCart();
  }, [countCart]);



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
  //Cap nhat so luong san pham trong gio hang
  const updateItem = (id, newValue) => {
    try {
      setCountCart(countCart + 1);
      //Cap nhat tren giao dien 
      let sum = 0;
      let listCartNew = [...listCart];
      for (let i = 0; i < listCart.length; i++) {
        if (listCart[i]._id === id) {
          listCart[i].amount = newValue;
          listCart[i].totalPrice = listCart[i].price * newValue;
          listCartNew[i] = listCart[i];
          listCartNew[i].totalPriceNoSale = listCart[i].priceNoSale * newValue;
          if (listCartNew[i].subProduct.sale == 0) {
            sum += listCartNew[i].totalPriceNoSale;
          } else {
            sum += listCartNew[i].totalPrice;
          }
        } else {
          if (listCartNew[i].subProduct.sale == 0) {
            sum += listCartNew[i].totalPriceNoSale;
          } else {
            sum += listCartNew[i].totalPrice;
          }
        }
      };

      setTotal(sum);
      setListCart(listCartNew);

      //Cap nhat tren database
      const item = listCart.find(item => item._id === id);
      updateItemCart(item._id, newValue, item.price, item.idOrder, item.idSubProduct, item.subProduct);
    } catch (error) {
      setIsLoading(false);
      console.log("Update item error: ", error);
    }
  };

  const updateItemCart = async (_idOrderDetail, _amount, price, _idOrder, _idSubProduct, subProduct) => {
    try {
      if (subProduct.quantity < _amount) {
        alert("Số lượng sản phẩm trong kho không đủ!");
        return;
      }
      await onUpdateOrderDetail(_idOrderDetail, _amount, price, false, _idOrder, _idSubProduct);
    } catch (error) {
      console.log("Update item cart error: ", error);
    }
  };

  //Xoa 1 san pham khoi gio hang
  const deleteItem = async (idOrderDetail) => {
    try {
      setIsLoading(true);
      const response = await onDeleteOrderDetail(idOrderDetail);
      setCountCart(countCart + 1);
      console.log("Delete cart item: ", response);
    } catch (error) {
      setIsLoading(false);
      console.log("Delete cart item error: ", error);
    }
  };

  //Xoa nhieu san pham khoi gio hang
  const deleteItems = async () => {
    try {
      setIsLoading(true);
      for (let i = 0; i < listCart.length; i++) {
        if (listCart[i].isSelect) {
          await onDeleteOrderDetail(listCart[i]._id);
        }
      }
      setCountCart(countCart + 1);
    } catch (error) {
      setIsLoading(false);
      console.log("Delete cart item error: ", error);
    }
  }

  //Chon 1 san pham trong gio hang
  const itemSelected = (item) => {
    item.isSelect = !item.isSelect;
    let sum = 0;
    let list = [];
    for (let i = 0; i < listCart.length; i++) {
      if (listCart[i].isSelect) {
        sum += listCart[i].totalPrice;
        list.push(listCart[i]);
      }
    }
    setListSelected(list);
    setTotal(sum);
    setListCart([...listCart]);
  }

  //Den trang thanh toan
  const goToCheckOut = () => {
    if (listCart.length == 0) {
      ToastAndroid.show("Please add product to cart!", ToastAndroid.SHORT);
      return;
    }
    let list = [];
    for (let i = 0; i < listCart.length; i++) {
      if (listCart[i].isSelect) {
        list.push(listCart[i]);
      }
    }
    const data = {
      listCart: list,
    }
    navigation.navigate("CheckOut", { data: data });
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}>
      <View style={
        {
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
          paddingVertical: 6, paddingHorizontal: 12, borderColor: '#ddd', borderBottomWidth: 1
        }
      }>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{ width: 22, height: 22 }}
            resizeMode='cover'
            source={require('../../../../assets/images/back.png')} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
          <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>Cart</Text>

        </View>

        {
          listSelected.length > 0 ?
            <TouchableOpacity onPress={deleteItems}>
              <Image
                style={{ width: 26, height: 26 }}
                resizeMode='cover'
                source={require('../../../../assets/images/ic_trash1.png')} />
            </TouchableOpacity> :
            <Image
              style={{ width: 26, height: 26 }}
              resizeMode='cover'
              source={require('../../../../assets/images/ic_trash2.png')} />

        }

      </View>
      {/* <SafeAreaView style={styles.container}> */}
      <ScrollView style={{ flex: 1, marginBottom: 20 }}>
        {/* <FlatList
          data={listCart}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
            <Item
              gotoProductDetail={() => navigation.navigate('ProductDetail', { idProduct: item.product._id, idSubProduct: item.idSubProduct })}
              deleteItem={() => deleteItem(item._id)}
              itemSelected={() => itemSelected(item)}
              plus={() => updateItem(item._id, item.amount > 9 ? item.amount : item.amount + 1)}
              minus={() => updateItem(item._id, item.amount > 1 ? item.amount - 1 : 1)}
              item={item} />
          }
          keyExtractor={item => item._id}
        /> */}
        {
          listCart.length > 0 ?
            listCart.map((item, index) => {
              return (
                <Item
                  key={index}
                  gotoProductDetail={() => navigation.navigate('ProductDetail', { idProduct: item.product._id, idSubProduct: item.idSubProduct })}
                  deleteItem={() => deleteItem(item._id)}
                  itemSelected={() => itemSelected(item)}
                  plus={() => updateItem(item._id, item.amount > 9 ? item.amount : item.amount + 1)}
                  minus={() => updateItem(item._id, item.amount > 1 ? item.amount - 1 : 1)}
                  item={item} />
              )
            }) :
            <View style={{ justifyContent: 'center', marginTop: 20, paddingHorizontal: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', }}>No product in cart</Text>
            </View>
        }

        {/* Danh sach san pham lien quan */}
        <View>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: 'black', marginHorizontal: 10, marginTop: 10 }}>Related products</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginHorizontal: 10 }}>
            {
              listPrd ?
                listPrd.map((item) =>
                  <Item2 key={item._id} item={item} onPress={() => navigation.navigate('ProductDetail', { idProduct: item._id })} />
                ) : null
            }
          </View>
        </View>
      </ScrollView>
      {
        listCart.length !== 0 ?
          <View style={{ justifyContent: 'space-between', paddingHorizontal: 12, }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 12 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: 'black' }}>Total:</Text>
              <Text style={{ fontSize: 20, color: 'red' }}>$ {total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              onPress={() => goToCheckOut()}
              style={{ backgroundColor: '#000', height: 50, borderRadius: 30, flexDirection: 'column', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Check out</Text>
            </TouchableOpacity>
          </View> :
          <View style={{
            backgroundColor: '#BBB', height: 50, borderRadius: 30,
            flexDirection: 'column', justifyContent: 'center',
            paddingHorizontal: 12, marginHorizontal: 12
          }}>
            <Text style={{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Check out</Text>
          </View>
      }

      {/* </SafeAreaView> */}


      <ProgressDialog
        visible={isLoading}
        loaderColor="black"
        lable="Please wait..."
      />
    </View>
  )
}

export default Cart

const Item2 = ({ item, onPress }) => (
  <TouchableOpacity style={{ flexWrap: 'wrap', width: '49%', marginBottom: 10 }} onPress={onPress}>
    <View style={styles.itemContainer}>
      <View style={{ width: '100%', height: '100%' }}>
        <View style={styles.viewSaleDam}>
          {/* <Text style={{ fontSize: 16, color: 'white', fontWeight: '600', marginRight: 8 }}></Text>
          <Text style={{ fontSize: 14, color: 'yellow', fontWeight: '400', fontFamily: 'Caveat' }}></Text> */}
        </View>
        <Image
          style={{ width: '100%', height: 160, position: 'relative' }}
          resizeMode='cover'
          source={{ uri: item.image }} />
        <Text numberOfLines={1} style={{ height: 19, color: 'black', fontWeight: '800', fontSize: 16, marginTop: 5, marginHorizontal: 8, maxWidth: '90%' }}>
          {item.name}
        </Text>
        <View style={{ flexDirection: 'row', paddingHorizontal: 8, marginTop: 5 }}>
          <Image
            style={{ width: 15, height: 15, marginEnd: 5 }}
            resizeMode='cover'
            source={require('../../../../assets/images/ic_star.png')}
          />
          <Text style={{ fontWeight: '700' }}>{item.rating}</Text>
        </View>

        {
          item.subProduct[0] != undefined && item.subProduct[0].sale > 0 ?
            <View style={{ flexDirection: 'row', paddingHorizontal: 8 }}>
              <Text style={{ height: 19, color: 'black', fontWeight: '700', fontSize: 14, lineHeight: 19.1, marginEnd: 5 }}>
                Price:
              </Text>
              <Text style={{ height: 19, color: 'black', textDecorationLine: 'line-through', fontWeight: '500', fontSize: 14, lineHeight: 19.1, }}>
                {item.subProduct[0].price} $
              </Text>
              <Text style={{ height: 19, color: 'red', fontWeight: '700', fontSize: 14, lineHeight: 19.1, marginStart: 10 }}>
                {item.subProduct[0].price - item.subProduct[0].price * item.subProduct[0].sale / 100} $
              </Text>
            </View> :
            <Text style={{ height: 19, color: 'black', fontWeight: '700', fontSize: 14, lineHeight: 19.1, paddingHorizontal: 8 }}>
              Price: {item.subProduct[0].price} $
            </Text>
        }

        {/* <View style={{ flexDirection: 'row', paddingHorizontal: 8 }}>
          <Image
            style={{ width: 15, height: 15, marginEnd: 5 }}
            resizeMode='cover'
            source={require('../../../../assets/images/ic_cpu.png')}
          />
          <Text numberOfLines={1} style={{ fontWeight: '700' }}>CPU {item.subProduct[0].cpu}</Text>
        </View>

        <View style={{ flexDirection: 'row', paddingHorizontal: 8 }}>
          <Image
            style={{ width: 15, height: 15, marginEnd: 5 }}
            resizeMode='cover'
            source={require('../../../../assets/images/ic_ram.png')}
          />
          <Text style={{ fontWeight: '700' }}>Ram {item.subProduct[0].ram} GB</Text>
        </View>

        <View style={{ flexDirection: 'row', paddingHorizontal: 8 }}>
          <Image
            style={{ width: 15, height: 15, marginEnd: 5 }}
            resizeMode='cover'
            source={require('../../../../assets/images/ic_rom.png')}
          />
          <Text style={{ fontWeight: '700' }}>Rom {item.subProduct[0].rom} GB</Text>
        </View>

        <View style={{ flexDirection: 'row', paddingHorizontal: 8, width: '80%' }}>
          <Image
            style={{ width: 15, height: 15, marginEnd: 5 }}
            resizeMode='cover'
            source={require('../../../../assets/images/ic_screen.png')}
          />
          <Text numberOfLines={1} style={{ fontWeight: '700', }}>Screen {item.subProduct[0].screen}</Text>
        </View> */}


      </View>
    </View>
  </TouchableOpacity>
);

const Item = ({ item, plus, minus, deleteItem, gotoProductDetail, itemSelected }) => (

  <View style={[styles.item, { position: 'relative' }]}>
    <View style={{ flexDirection: 'row', }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        <TouchableOpacity
          onPress={itemSelected}
          style={{
            borderWidth: 1, borderColor: '#333', borderRadius: 4,
            padding: 4, marginRight: 10, width: 24, height: 24,
            justifyContent: 'center', alignItems: 'center'
          }}>
          <View style={item.isSelect ? styles.itemChange : styles.itemNoChange}></View>
        </TouchableOpacity>

        <TouchableOpacity onPress={gotoProductDetail}>
          <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 5, marginTop: 5 }}>
            <Image source={{ uri: item.imageurl }} style={styles.image} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ justifyContent: 'space-between', paddingVertical: 5, paddingStart: 10 }}>
        <View>
          <Text numberOfLines={1} style={{ fontSize: 18, fontWeight: '800', color: 'black', width: '90%' }}>{item.prodName}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 250, alignItems: 'center' }}>
            <View style={{ marginTop: 4, width: '100%' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: 'black', marginRight: 30 }}>
                  Color: {item.color.charAt(0).toUpperCase() + item.color.slice(1)}
                </Text>
                <View style={styles.qualityRange}>
                  <TouchableOpacity onPress={plus}>
                    <Image
                      style={{ width: 25, height: 25 }}
                      source={require('../../../../assets/images/btn_plus.png')}
                    />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 18 }}>{item.amount}</Text>
                  <TouchableOpacity onPress={minus}>
                    <Image
                      style={{ width: 25, height: 25 }}
                      source={require('../../../../assets/images/btn_minus.png')} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: 'black', marginTop: 4 }}>Price: </Text>
                {
                  item.subProduct.sale > 0 ?
                    <Text style={{ fontSize: 16, fontWeight: '400', color: 'black', marginTop: 4, marginRight: 8, textDecorationLine: 'line-through' }}>
                      $ {item.totalPriceNoSale.toFixed(2)}
                    </Text> : null
                }
                <Text style={{ fontSize: 16, fontWeight: '600', color: 'red', marginTop: 4 }}>$ {item.totalPrice.toFixed(2)}</Text>
              </View>

            </View>


          </View>

        </View>

      </View>
    </View>
    {/* <TouchableOpacity style={{ position: 'absolute', top: 8, right: 10 }} onPress={deleteItem}>
      <Image source={require('../../../../assets/images/del.png')} style={{ width: 20, height: 20, }} />
    </TouchableOpacity> */}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 6,
    //marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    paddingBottom: 5,
    marginBottom: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.2,
    borderBottomColor: 'gray',

  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  title: {
    fontSize: 32,
  },
  qualityRange:
  {
    width: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemChange: {
    width: 18,
    height: 18,
    backgroundColor: 'black',
    borderRadius: 4,
  },
  itemNoChange: {
    width: 18,
    height: 18,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  itemContainer: {
    flex: 1,
    width: '100%',
    // elevation: 5,
    // shadowColor: 'grey',
    borderRadius: 8,
    paddingBottom: 12,
    // shadowOffset: {
    //   width: 1,
    //   height: 3
    // },
    backgroundColor: '#F5F5F5',
    // shadowRadius: 5,
    // shadowOpacity: 0.3
  },
  viewSaleDam: {
    flexDirection: 'row',
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderTopEndRadius: 8,
    borderTopStartRadius: 8
  },

})

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    prodName: 'Iphone 14',
    price: '50.00',
    quality: '01',
    imageurl: 'https://cdn.tgdd.vn/Products/Images/42/247508/iphone-14-pro-tim-thumb-600x600.jpg',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    prodName: 'Iphone 14',
    price: '50.00',
    quality: '01',
    imageurl: 'https://cdn.tgdd.vn/Products/Images/42/247508/iphone-14-pro-tim-thumb-600x600.jpg',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f64',
    prodName: 'Second Item',
    price: '50.00',
    quality: '01',
    imageurl: 'https://cdn.tgdd.vn/Products/Images/42/247508/iphone-14-pro-tim-thumb-600x600.jpg',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    prodName: 'Second Item',
    price: '50.00',
    quality: '01',
    imageurl: 'https://cdn.tgdd.vn/Products/Images/42/247508/iphone-14-pro-tim-thumb-600x600.jpg',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d73',
    prodName: 'Third Item',
    price: '50.00',
    quality: '01',
    imageurl: 'https://cdn.tgdd.vn/Products/Images/42/247508/iphone-14-pro-tim-thumb-600x600.jpg',
  },
];