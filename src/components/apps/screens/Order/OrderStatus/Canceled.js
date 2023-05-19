import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../AppContext';
import { UserContext } from '../../../../users/UserContext';

import ProgressDialog from 'react-native-progress-dialog';

const Item = ({ item, onpress }) => (
  <View style={styles.containerItem}>
    <View style={styles.rowItem}>
      <Text style={{ fontSize: 16, fontWeight: '600', color: 'black' }}>Order {item._id}</Text>
      <Text style={{ fontSize: 16, fontWeight: '400' }}>{item.orderDate}</Text>
    </View>
    <View style={{ borderBottomWidth: 1, borderBottomColor: 'black', marginVertical: 10 }}></View>
    <View style={styles.rowItem}>
      <View style={styles.rowItem}>
        <Text style={{ fontSize: 16, fontWeight: '400' }}>Quantity: </Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: 'black' }}>{item.quantity}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text style={{ fontSize: 16, fontWeight: '400' }}>Total Amount: </Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: 'black' }}>{item.totalPrice}</Text>
      </View>
    </View>
    <View style={[styles.rowItem, { marginTop: 16 }]}>
      <TouchableOpacity onPress={onpress} style={styles.buttonDetail}>
        <Text style={styles.textDetail}>Detail</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 16, fontWeight: '600', color: 'red' }}>{item.status}</Text>
    </View>
  </View>
);

const Canceled = (props) => {
  const { navigation } = props;
  const { } = useContext(AppContext);
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const [listCanceled, setListCanceled] = useState([]);

  useEffect(() => {
    const getOrderByIdUserAndStatus = async () => {

    };
    getOrderByIdUserAndStatus();
  }, []);



  const gotoOrderDetail = (item) => {
    navigation.navigate('OrderDetail', { item });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <ProgressDialog
        visible={isLoading}
        loaderColor="black"
        lable="Vui lòng đợi trong giây lát..."
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
  }
})