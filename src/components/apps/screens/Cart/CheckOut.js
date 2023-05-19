import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import back from '../../../back/back';
import { UserContext } from '../../../users/UserContext';
import { AppContext } from '../../AppContext';

const CheckOut = (props) => {
  const { navigation } = props;
  const { user } = useContext(UserContext);
  const { } = useContext(AppContext);

  const [isSelect, setIsSelect] = useState('1');

  back(navigation);

  const gotoSuccess = async () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const orderDate = `${day}/${month}/${year}`;
    const status = "Processing";

    navigation.navigate("Success");
  };

  const handleSelected = (id) => {
    setIsSelect(id);
    if(id == '1'){
      // Bấm đây nhảy qua thanh toán khi nhận hàng
      console.log('Thanh toán khi nhận hàng');
    }else{
      console.log('Thanh toán bằng Paypal');
      // Bấm đây nhảy qua paypal
    }
  }

  return (

    <View style={{ flex: 1, paddingHorizontal: 12, justifyContent: 'space-between', backgroundColor: 'white' }}>

      {/* Bấm đây nhảy qua cart () */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Image
            style={{ width: 22, height: 22 }}
            resizeMode='cover'
            source={require('../../../../assets/images/back.png')} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
          <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>CheckOut</Text>

        </View>

        <View style={{ width: 22, height: 22 }} />
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        {/* Address */}
        <View style={{ justifyContent: 'space-between', marginTop: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: 'black' }}>Shipping Address</Text>
            <Image
              source={require('../../../../assets/images/edit.png')}
              style={{ width: 20, height: 20, resizeMode: 'contain' }}
            />
          </View>
          <View style={[styles.box, { backgroundColor: '#fff', borderRadius: 8, paddingVertical: 10, }]}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', borderBottomWidth: 0.5, borderBottomColor: 'grey', padding: 10 }}>{user.name}</Text>
            <Text style={{ fontSize: 14, lineHeight: 25, padding: 10, fontWeight: '400' }}>Phone: 0778023038</Text>
            <Text style={{ fontSize: 14, marginHorizontal: 10, marginBottom: 10, fontWeight: '400' }}>Address: 74/12 KP Noi Hoa 1 - Binh An - Di An - Binh Duong</Text>
          </View>
        </View>

        {/* Delivery method */}
        <View style={{ justifyContent: 'space-between', marginTop: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: 'black' }}>Payment method</Text>
            <View style={{width: 20, height: 20}}/>

          </View>
          <View style={[styles.box, { borderRadius: 8, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }]}>

            <TouchableOpacity
              onPress={() => handleSelected('1')}
              style={isSelect == '1' ? styles.box1 : styles.box2}>
              <Image
                source={require('../../../../assets/images/cast2.jpg')}
                style={{ height: 50, width: 90, borderRadius: 8 }} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSelected('2')}
              style={isSelect == '2' ? styles.box1 : styles.box2}>
              <Image
                source={require('../../../../assets/images/paypal1.png')}
                style={{ height: 50, width: 90, borderRadius: 8 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Total price */}
        <View style={[styles.box, { padding: 10, borderRadius: 8, height: 125, justifyContent: 'space-between', marginTop: 10, marginBottom: 20, }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18 }}>Order:</Text>
            <Text style={{ fontSize: 18, fontWeight: '300' }}>$ 997</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18 }}>Delivery::</Text>
            <Text style={{ fontSize: 18, fontWeight: '300' }}>$ 3</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18 }}>Total:</Text>
            <Text style={{ fontSize: 18, fontWeight: '300' }}>$ 1000</Text>
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity onPress={() => gotoSuccess()} style={{ backgroundColor: '#000', height: 50, borderRadius: 30, flexDirection: 'column', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>SUBMIT ORDER</Text>
          {/* Bấm đây nhảy qua success */}
        </TouchableOpacity>
      </ScrollView>
    </View>

  )
}

export default CheckOut

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: 'grey',
    borderRadius: 4,
    shadowOffset: {
      width: 1,
      height: 3
    },
    marginHorizontal: 1,
    shadowRadius: 5,
    shadowOpacity: 0.3
  },
  box1: {
    padding: 10, borderColor: '#333', borderRadius: 8, borderWidth: 1, marginLeft: 10
  },
  box2: {
    padding: 10, borderColor: '#ddd', borderRadius: 8, borderWidth: 1, marginLeft: 10
  },
})