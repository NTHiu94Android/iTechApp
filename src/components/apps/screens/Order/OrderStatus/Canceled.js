import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../AppContext';
import { UserContext } from '../../../../users/UserContext';
import ProgressDialog from 'react-native-progress-dialog';

const Item = ({ item, onpress }) => (
  <View style={styles.containerItem}>
    <View style={styles.rowItem}>
      <Text style={{ fontSize: 16, fontWeight: '600', color: 'black' }}>Order {item._id}</Text>
      <Text style={{ fontSize: 16, fontWeight: '400' }}>{item.dateCreate}</Text>
    </View>
    <View style={{ borderBottomWidth: 1, borderBottomColor: 'black', marginVertical: 10 }}></View>
    <View style={{ flexDirection: 'column' }}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          style={{ width: 70, height: 70, borderRadius: 10 }}
          source={{ uri: item.product.image }}
        />
        <View style={styles.listItemName}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text numberOfLines={1} style={{ color: 'black', fontSize: 16, fontWeight: '800', maxWidth: 180 }}>
                {item.product.name}
              </Text>
              <Text style={styles.TextlstPrice}>Color: {item.subProduct.color}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
            <Text style={styles.TextlstPrice}>
              $ {(item.orderDetails[0].price * item.orderDetails[0].quantity).toFixed(2)}
            </Text>
            <Text style={styles.TextlstPrice}>x{item.orderDetails[0].quantity}</Text>
          </View>
        </View>
      </View>
      <View style={{ borderBottomWidth: 1, borderBottomColor: 'black', marginVertical: 10 }}></View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={styles.rowItem}>
          <Text style={{ fontSize: 16, fontWeight: '400' }}>Quantity: </Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: 'black' }}>{item.quantity}</Text>
        </View>
        <View style={styles.rowItem}>
          <Text style={{ fontSize: 16, fontWeight: '400' }}>Total Amount: </Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: 'black' }}>{item.totalPrice.toFixed(2)}</Text>
        </View>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <View style={styles.rowItem}>
          <Text style={{ fontSize: 16, fontWeight: '400' }}>Status: </Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: 'red' }}>{item.status}</Text>
        </View>
        <View style={[styles.rowItem, ]}>
          <TouchableOpacity onPress={onpress} style={styles.buttonDetail}>
            <Text style={styles.textDetail}>See more</Text>
          </TouchableOpacity>
          {/* <Text style={{ fontSize: 16, fontWeight: '600', color: 'red' }}>{item.status}</Text> */}
        </View>
      </View>
    </View>
  </View>
);

const Canceled = ({navigation, route}) => {
  //const { listCanceled } = useContext(AppContext);
  //const listCanceled = [];
  const { 
    onGetOrdersByIdUser, countOrder, 
    onGetOrderDetailByIdOrder, onGetSubProductById, 
    onGetProductById 
  } = useContext(AppContext);
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const [listCanceled, setListCanceled] = useState([]);

  useEffect(() => {
    const getOrderByIdUserAndStatus = async () => {
      try {
        const resOrders = await onGetOrdersByIdUser(user._id);
        const orders = resOrders.data;
        //Lay tat ca hoa don tru idCart va idFavorite
        let list = [];
        for (let i = 0; i < orders.length; i++) {
          if (orders[i].status == 'Canceled') {
            const resOrderDetails = await onGetOrderDetailByIdOrder(orders[i]._id);
            const orderDetails = resOrderDetails.data;
            const resSubProduct = await onGetSubProductById(orderDetails[0].idSubProduct);
            const product = await onGetProductById(resSubProduct.idProduct);
            let sum = 0;
            for (let j = 0; j < orderDetails.length; j++) {
              sum += orderDetails[j].quantity;
            }
            orders[i].quantity = sum;
            orders[i].orderDetails = orderDetails;
            orders[i].product = product;
            orders[i].subProduct = resSubProduct;
            list.push(orders[i]);
          }
        }
        setListCanceled(list);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log("Error getOrders", error);
      }
    };
    getOrderByIdUserAndStatus();
  }, [countOrder]);



  const gotoOrderDetail = (item) => {
    navigation.navigate('OrderDetail', { item });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <ProgressDialog
        visible={isLoading}
        loaderColor="black"
        lable="Please wait..."
      />
      <View style={styles.container}>
        {
          listCanceled.length > 0 &&
          listCanceled.map((item) => <Item key={item._id} item={item} onpress={() => gotoOrderDetail(item)} />)
        }
      </View>
    </ScrollView>
  )
}

export default Canceled

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: 'white',
  },
  containerItem: {
    flexDirection: 'column',
    padding: 12,
    backgroundColor: 'white',
    shadowColor: 'grey',
    borderRadius: 4,
    elevation: 5,
    shadowOffset: {
      width: 1,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    marginBottom: 6
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonDetail: {
    backgroundColor: 'black',
    width: 100,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 10,
  },
  textDetail: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  listItemName: {
    marginStart: 20,
    width: '72%'
  },
  TextlstName: {
    fontWeight: 'normal',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 5,
    width: 150,
  },
  TextlstPrice: {
    fontWeight: 'bold',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 5,
  },
})