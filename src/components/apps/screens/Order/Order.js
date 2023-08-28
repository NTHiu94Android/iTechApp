import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Delivered from './OrderStatus/Delivered';
import Canceled from './OrderStatus/Canceled';
import Processing from './OrderStatus/Processing';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import backToScreen from '../../../back/backToScreen';
import { AppContext } from '../../AppContext';
import { UserContext } from '../../../users/UserContext';
import ProgressDialog from 'react-native-progress-dialog';

const Tab = createMaterialTopTabNavigator();

const Order = (props) => {
  const { navigation } = props;
  backToScreen(navigation, 'BottomNavigation');

  // useEffect(() => {
  //   const getOrderByIdUserAndStatus = async () => {
  //     try {
  //       setIsLoading(true);
  //       const resOrders = await onGetOrdersByIdUser(user._id);
  //       const orders = resOrders.data;
  //       //Lay tat ca hoa don tru idCart va idFavorite
  //       let list1 = [];
  //       let list2 = [];
  //       let list3 = [];
  //       if (orders.length == 0) {
  //         setIsLoading(false);
  //         console.log("orders.length == 0", orders.length);
  //         return;
  //       }
  //       //console.log("orderDetails", orderDetails[0]);
  //       for (let i = 0; i < orders.length; i++) {
  //         let sum1 = 0;
  //         let sum2 = 0;
  //         let sum3 = 0;
  //         const resOrderDetails = await onGetOrderDetailByIdOrder(orders[i]._id);
  //         const orderDetails = resOrderDetails.data;
  //         if (orderDetails.length > 0) {
  //           const subProduct = await onGetSubProductById(orderDetails[0].idSubProduct);
  //           const product = await onGetProductById(subProduct.idProduct);
  //           if (orders[i].status == 'Delivered') {
  //             for (let j = 0; j < orderDetails.length; j++) {
  //               sum1 += orderDetails[j].quantity;
  //             }
  //             orders[i].quantity = sum1;
  //             orders[i].orderDetails = orderDetails;
  //             orders[i].product = product;
  //             orders[i].subProduct = subProduct;
  //             list1.push(orders[i]);
  //           }
  //           if (orders[i].status == 'Processing' || orders[i].status == 'Confirmed') {
  //             for (let j = 0; j < orderDetails.length; j++) {
  //               sum2 += orderDetails[j].quantity;
  //             }
  //             orders[i].quantity = sum2;
  //             orders[i].orderDetails = orderDetails;
  //             orders[i].product = product;
  //             orders[i].subProduct = subProduct;
  //             list2.push(orders[i]);
  //           }
  //           if (orders[i].status == 'Canceled') {
  //             for (let j = 0; j < orderDetails.length; j++) {
  //               sum3 += orderDetails[j].quantity;
  //             }
  //             orders[i].quantity = sum3;
  //             orders[i].orderDetails = orderDetails;
  //             orders[i].product = product;
  //             orders[i].subProduct = subProduct;
  //             list3.push(orders[i]);
  //           }
  //         }

  //       }
  //       console.log("list1", list1.length);
  //       console.log("list2", list2.length);
  //       console.log("list3", list3.length);
  //       setListDelivered(list1);
  //       setListProcessing(list2);
  //       setListCanceled(list3);
  //       setIsLoading(false);
  //     } catch (error) {
  //       setIsLoading(false);
  //       console.log("Error getOrders", error);
  //     }
  //   };
  //   getOrderByIdUserAndStatus();
  // }, [countOrder]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* <ProgressDialog
        visible={isLoading}
        loaderColor="black"
        lable="Vui lòng đợi trong giây lát..."
      /> */}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, paddingHorizontal: 12 }}>
        <TouchableOpacity onPress={() => navigation.navigate('BottomNavigation')}>
          <Image
            style={{ width: 22, height: 22 }}
            resizeMode='cover'
            source={require('../../../../assets/images/back.png')} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
          <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>My Order</Text>
        </View>
        <View style={{ width: 22, height: 22 }} />
      </View>

      <Tab.Navigator
        screenOptions={() => ({
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          tabBarIndicatorStyle: {
            backgroundColor: 'black',
            height: 3,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: 'bold',
          }
        })}
      >
        <Tab.Screen
          name="Processing"
          options={{
            headerShown: false,
          }}
          component={Processing}
        />
        <Tab.Screen
          name="Delivered"
          options={{
            headerShown: false,
          }}
          component={Delivered}
        />
        <Tab.Screen
          name="Canceled"
          options={{
            headerShown: false,
          }}
          component={Canceled}
        />
      </Tab.Navigator>
    </View>


  )
}

export default Order

const styles = StyleSheet.create({
  iconTopBar: {
    width: 24, height: 24,
  },
  textProfile: {
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
    fontWeight: '800',
  },
})