import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'

import { AppContext } from '../../AppContext';
import { UserContext } from '../../../users/UserContext';

import ProgressDialog from 'react-native-progress-dialog';

const Favorite = (props) => {
  const { navigation } = props;
  const { user } = useContext(UserContext);
  const {
    onGetOrderDetailByIdOrder, listFavorite, setListFavorite, onAddAllFavoriteToCart,
    //Count
    countFavorite, setCountFavorite, setNumberFavorite,
    //Product
    onGetProducts,
    //Sub product
    onGetSubProductById,
    //Order detail
    onAddOrderDetail, onDeleteOrderDetail, 
    objRef
  } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isFirstRun, setIsFirstRun] = useState(true);
  
  

  //Lay danh sach san phma trong gio hang
  useEffect(() => {
    const getListfavorite = async () => {
      try {
        if (isFirstRun) {
          setIsFirstRun(false);
          setIsLoading(true);
        }
        const resProduct = objRef.current.listProducts;
        const listProduct = resProduct.data;
        const response = await onGetOrderDetailByIdOrder(user.idFavorite);
        if (!response || response.data == undefined) {
          setIsLoading(false);
          return;
        }
        let numberFavorite = 0;
        for (let i = 0; i < response.data.length; i++) {
          numberFavorite++;
          const subProduct = await onGetSubProductById(response.data[i].idSubProduct);
          const product = listProduct.find(item => item._id === subProduct.idProduct);
          response.data[i].idSubProduct = subProduct._id;
          response.data[i].product = product;
          response.data[i].image = product.image;
          response.data[i].color = subProduct.color;
          response.data[i].name = product.name;
          subProduct.sale == 0 ?
            response.data[i].price = subProduct.price :
            response.data[i].price = subProduct.price - (subProduct.price * subProduct.sale / 100);
        }
        setNumberFavorite(numberFavorite);
        setListFavorite(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log("Get list favorite error: ", error);
      }
    };
    getListfavorite();
  }, [countFavorite]);

  //Them tat ca san pham yeu thich vao gio hang
  const addAllToCart = async () => {
    try {
      setIsLoading(true);
      await onAddAllFavoriteToCart(listFavorite);
    } catch (error) {
      setIsLoading(false);
      console.log("Add to cart error: ", error);
    }
  };

  //Xoa san pham khoi danh sach yeu thich
  const deleteFavoriteItem = async (idOrderDetail) => {
    try {
      setIsLoading(true);
      await onDeleteOrderDetail(idOrderDetail);
      setCountFavorite(countFavorite + 1);
    } catch (error) {
      setIsLoading(false);
      console.log("Delete favorite item error: ", error);
    }
  };

  //Them 1 san pham yeu thich vao gio hang
  const addOneToCart = async (it) => {
    try {
      setIsLoading(true);
      const subProduct = await onGetSubProductById(it.idSubProduct);
      if(subProduct.quantity == 0){
        setIsLoading(false);
        ToastAndroid.show("This product is out of stock", ToastAndroid.SHORT);
        return;
      }
      await onAddOrderDetail(1, 0, user.idCart, it.idSubProduct);
      await deleteFavoriteItem(it._id);
      setCountFavorite(countFavorite + 1);
    } catch (error) {
      setIsLoading(false);
      console.log("Add 1 to cart fail: ", error);
    }
  };

  return (
    <View style={{ position: 'relative', flex: 1, backgroundColor: 'white' }}>
      {/* Top bar */}
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
          <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>Favorite</Text>

        </View>

        <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
          <Image
            style={{ width: 22, height: 22 }}
            resizeMode='cover'
            source={require('../../../../assets/images/ic_search.png')} />
        </TouchableOpacity>
      </View>



      <FlatList
        data={listFavorite}
        renderItem={({ item }) =>
          <Item
            addOneToCart={() => addOneToCart(item)}
            deleteFavoriteItem={() => deleteFavoriteItem(item._id)}
            gotoProductDetail={() => navigation.navigate('ProductDetail',
              { idProduct: item.product._id, idSubProduct: item.idSubProduct }
            )}
            name={item.name}
            color={item.color}
            image={item.image}
            price={item.price} />
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item._id}
      />

      {
        listFavorite && listFavorite.length !== 0 ?
          <TouchableOpacity onPress={() => addAllToCart()} style={styles.button}>
            <Text style={styles.buttonText}>Add all to my cart</Text>
          </TouchableOpacity> :
          <View style={[styles.button, { backgroundColor: '#BBB' }]}>
            <Text style={styles.buttonText}>Add all to my cart</Text>
          </View>
      }

      <ProgressDialog
        visible={isLoading}
        loaderColor="black"
        lable="Please wait..."
      />

    </View>

  )
}

export default Favorite

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
    marginHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  Icon: {
    width: 24,
    height: 24,
  },
  h1: {
    color: 'black',
    fontSize: 18,
    fontWeight: '800',
    flex: 8,
    textAlign: 'center',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 0,
    marginHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.2)',

  },
  imgLst: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  listItemName: {
    flex: 5,
    paddingStart: 20,
  },
  TextlstName: {
    fontWeight: 'normal',
    fontSize: 18,
    color: 'black',
    fontWeight: '800',
    marginBottom: 5,
  },
  TextlstPrice: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
    marginTop: 5,
  },
  listItemIcon: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    position: 'absolute',
    width: '80%',
    alignItems: 'center',
    bottom: 10,
    backgroundColor: 'black',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600'
  },

})

const Item = ({ name, price, image, color, deleteFavoriteItem, addOneToCart, gotoProductDetail }) => {
  return (
    <View style={styles.listItem}>
      <TouchableOpacity onPress={gotoProductDetail}>
        <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8 }}>
          <Image source={{ uri: image }} style={styles.imgLst} />
        </View>
      </TouchableOpacity>
      <View style={styles.listItemName}>
        <Text numberOfLines={1} style={styles.TextlstName}>{name}</Text>
        <Text style={{ fontSize: 16, color: 'black', fontWeight: '600' }}>{color}</Text>
        <Text style={styles.TextlstPrice}>$ {price}</Text>
      </View>
      <View style={styles.listItemIcon}>
        <TouchableOpacity onPress={deleteFavoriteItem}>
          <View style={{ width: '100%', alignItems: 'center', marginVertical: 5 }}>
            <Image source={require('../../../../assets/images/del.png')} style={{ width: 24, height: 24 }} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={addOneToCart}>
          <View style={{ width: '100%', alignItems: 'center', marginVertical: 5 }}>
            <Image source={require('../../../../assets/images/shop.png')} style={{ width: 24, height: 24 }} />
          </View>
        </TouchableOpacity>
      </View>
    </View>

  );
};
