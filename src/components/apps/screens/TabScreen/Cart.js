import { FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, alert } from 'react-native'
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
    countCart, setCountCart,
    //Sub product
    onGetSubProductById,
    //Product
    onGetProducts,
    //Order detail
    onUpdateOrderDetail, onDeleteOrderDetail,
  } = useContext(AppContext);

  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


  //Lay danh sach san pham trong gio hang
  useEffect(() => {
    const getListCart = async () => {
      try {
        setIsLoading(true);
        const resProduct = await onGetProducts();
        const listProduct = resProduct.data;
        const response = await onGetOrderDetailByIdOrder(user.idCart);
        if (response.data == undefined) {
          setListCart([]);
          setIsLoading(false);
          return;
        }
        const data = response.data;
        let sum = 0;
        //console.log("List cart: ", response);
        for (let i = 0; i < data.length; i++) {
          const subProduct = await onGetSubProductById(data[i].idSubProduct);
          const product = listProduct.find(item => item._id === subProduct.idProduct);
          data[i].imageurl = product.image;
          data[i].prodName = product.name;
          data[i].color = subProduct.color;
          if (subProduct.sale == 0) {
            data[i].price = subProduct.price;
          } else {
            data[i].price = subProduct.price - (subProduct.price * subProduct.sale / 100);
          }
          data[i].totalPrice = subProduct.price * data[i].quantity;
          data[i].amount = data[i].quantity;

          sum += data[i].totalPrice;
        }
        setListCart(data);
        setTotal(sum);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log("Get list cart error: ", error);
      }
    };
    getListCart();
  }, [countCart]);

  //Cap nhat so luong san pham trong gio hang
  const updateItem = (id, newValue) => {
    try {
      setIsLoading(true);
      //Cap nhat tren giao dien 
      for (let i = 0; i < listCart.length; i++) {
        if (listCart[i]._id === id) {
          listCart[i].amount = newValue;
          listCart[i].totalPrice = listCart[i].price * newValue;
          updateItemCart(listCart[i]._id, newValue, listCart[i].idOrder, listCart[i].idSubProduct);
          break;
        }
      };
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("Update item error: ", error);
    }
  };

  const updateItemCart = async (_idOrderDetail, _amount, _idOrder, _idSubProduct) => {
    try {
      const subProduct = await onGetSubProductById(_idSubProduct);
      if (subProduct.quantity < _amount) {
        alert("Số lượng sản phẩm trong kho không đủ!");
        return;
      }
      await onUpdateOrderDetail(_idOrderDetail, _amount, _idOrder, _idSubProduct);
      setCountCart(countCart + 1);
    } catch (error) {
      console.log("Update item cart error: ", error);
    }
  };

  //Xoa san pham khoi gio hang
  const deleteItem = async (idOrderDetail) => {
    try {
      const response = await onDeleteOrderDetail(idOrderDetail);
      setCountCart(countCart + 1);
      console.log("Delete favorite item: ", response);
    } catch (error) {
      console.log("Delete favorite item error: ", error);
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{ width: 22, height: 22 }}
            resizeMode='cover'
            source={require('../../../../assets/images/back.png')} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
          <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>Cart</Text>

        </View>

        <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
          <Image
            style={{ width: 22, height: 22 }}
            resizeMode='cover'
            source={require('../../../../assets/images/ic_search.png')} />
        </TouchableOpacity>
      </View>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={listCart}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
            <Item
              deleteItem={() => deleteItem(item._id)}
              plus={() => updateItem(item._id, item.amount > item.quantity || item.amount > 9 ? item.amount : item.amount + 1)}
              minus={() => updateItem(item._id, item.amount > 1 ? item.amount - 1 : 1)}
              item={item} />
          }
          keyExtractor={item => item._id}
        />
        {
          listCart.length !== 0 ?
            <View style={{ height: 150, justifyContent: 'space-between', paddingHorizontal: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#ffff', borderRadius: 10, paddingStart: 11 }}>
                <TextInput>Enter your promo code</TextInput>
                {/* <AntDesign name="rightsquare" size={44} color="black" /> */}
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 20 }}>Total:</Text>
                <Text style={{ fontSize: 20 }}>$ {total}</Text>
              </View>

              <TouchableOpacity onPress={() => navigation.navigate("CheckOut")} style={{ backgroundColor: '#000', height: 50, borderRadius: 8, flexDirection: 'column', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Check out</Text>
                {/* Bấm đây nhảy qua check out */}
              </TouchableOpacity>
            </View> :
            <View style={{ backgroundColor: '#BBB', height: 50, borderRadius: 8, flexDirection: 'column', justifyContent: 'center', paddingHorizontal: 12 }}>
              <Text style={{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Check out</Text>
            </View>
        }
      </SafeAreaView>


      <ProgressDialog
        visible={isLoading}
        loaderColor="black"
        lable="Vui lòng đợi trong giây lát..."
      />
    </View>
  )
}

export default Cart

const Item = ({ item, plus, minus, deleteItem }) => (

  <View style={styles.item}>
    <View style={{ flexDirection: 'row' }}>
      <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8 }}>
        <Image source={{ uri: item.imageurl }} style={styles.image} />
      </View>
      <View style={{ justifyContent: 'space-between', paddingVertical: 5, paddingStart: 10 }}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: '800', color: 'black' }}>{item.prodName}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 200, alignItems: 'center' }}>
            <View style={{ marginTop: 4 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: 'black' }}>{item.color}</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: 'black', marginTop: 4 }}>$ {item.totalPrice}</Text>
            </View>
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

        </View>

      </View>
    </View>
    <TouchableOpacity onPress={deleteItem}>
      <Image source={require('../../../../assets/images/del.png')} style={{ width: 24, height: 24 }} />
    </TouchableOpacity>
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
    width: 80,
    height: 80,
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