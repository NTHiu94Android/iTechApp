import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../AppContext';
import { UserContext } from '../../../../users/UserContext';

import ProgressDialog from 'react-native-progress-dialog';

const Processing = (props) => {
  const { navigation } = props;
  const { 
    onGetOrdersByIdUser, onGetOrderDetailByIdOrder, onUpdateOrder,
    countOrder, setCountOrder,
   } = useContext(AppContext);
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [listProcessing, setListProcessing] = useState([]);

  useEffect(() => {
    const getOrderByIdUserAndStatus = async () => {
      try {
        setIsLoading(true);
        const resOrders = await onGetOrdersByIdUser(user._id);
        const orders = resOrders.data;
        //Lay tat ca hoa don tru idCart va idFavorite
        let list = [];
        for (let i = 0; i < orders.length; i++) {
          if (orders[i].status == 'Processing' || orders[i].status == 'Confirmed') {
            const resOrderDetails = await onGetOrderDetailByIdOrder(orders[i]._id);
            const orderDetails = resOrderDetails.data;
            let sum = 0;
            for (let j = 0; j < orderDetails.length; j++) {
              sum += orderDetails[j].quantity;
            }
            orders[i].quantity = sum;
            orders[i].orderDetails = orderDetails;
            list.push(orders[i]);
          }
        }
        setListProcessing(list);
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

  const cancelOrder = async (item) => {
    try {
      setIsLoading(true);
      await onUpdateOrder(item._id, item.datePayment, 'Canceled');
      setCountOrder(countOrder+1);
    } catch (error) {
      console.log('Error cancel order: ', error);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <ProgressDialog
        visible={isLoading}
        loaderColor="black"
        lable="Vui lòng đợi trong giây lát..."
      />
      <View style={styles.container}>
        {
          listProcessing.length > 0 &&
          listProcessing.map((item) =>
            <Item
              key={item._id}
              item={item}
              cancel={() => cancelOrder(item)}
              onpress={() => gotoOrderDetail(item)} />)
        }
      </View>
    </ScrollView>
  )
}

export default Processing

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
  }
});

const Item = ({ item, onpress, cancel }) => (
  <View style={styles.containerItem}>
    <View style={styles.rowItem}>
      <Text style={{ fontSize: 16, fontWeight: '600', color: 'black' }}>Order {item._id}</Text>
      <Text style={{ fontSize: 16, fontWeight: '400' }}>{item.dateCreate}</Text>
    </View>
    <View style={{ borderBottomWidth: 1, borderBottomColor: 'black', marginVertical: 10 }}></View>
    <View style={{ flexDirection: 'column' }}>
      <View style={styles.rowItem}>
        <Text style={{ fontSize: 16, fontWeight: '400' }}>Quantity: </Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: 'black' }}>{item.quantity}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text style={{ fontSize: 16, fontWeight: '400' }}>Total Amount: </Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: 'black' }}>{item.totalPrice}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text style={{ fontSize: 16, fontWeight: '400' }}>Date create: </Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: 'black' }}>{item.dateCreate}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text style={{ fontSize: 16, fontWeight: '400' }}>Payment method: </Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: 'black' }}>{item.paymentMethod}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text style={{ fontSize: 16, fontWeight: '400' }}>Status: </Text>
        {
          item.status == 'Processing' && <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFD700' }}>{item.status}</Text>
        }
        {
          item.status == 'Confirmed' && <Text style={{ fontSize: 16, fontWeight: '600', color: '#27AE60' }}>{item.status}</Text>
        }
      </View>
    </View>
    <View style={[styles.rowItem, { marginTop: 16 }]}>
      <TouchableOpacity onPress={onpress} style={styles.buttonDetail}>
        <Text style={styles.textDetail}>Detail</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={cancel} style={[styles.buttonDetail, { backgroundColor: 'red' }]}>
        <Text style={styles.textDetail}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const data = [
  {
    _id: "No238562312",
    orderDate: "20/03/2020",
    quantity: 3,
    totalPrice: 140,
    status: "Processing"
  },
  {
    _id: "No238562313",
    orderDate: "20/03/2020",
    quantity: 8,
    totalPrice: 440,
    status: "Confirmed"
  },
  {
    _id: "No238562314",
    orderDate: "20/03/2020",
    quantity: 5,
    totalPrice: 250,
    status: "Processing"
  },
];