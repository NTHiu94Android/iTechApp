import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import back from '../../../back/back';
import { UserContext } from '../../../users/UserContext';
import { AppContext } from '../../AppContext';

const CheckOut = (props) => {
  const { navigation } = props;
  const { user } = useContext(UserContext);
  const { } = useContext(AppContext);
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
            <Text style={{ fontSize: 18, fontWeight: '300' }}>Shipping Address</Text>
            <Image
              source={require('../../../../assets/images/edit.png')}
              style={{ width: 20, height: 20, resizeMode: 'contain' }}
            />
          </View>
          <View style={[styles.box, { backgroundColor: '#fff', borderRadius: 8, paddingVertical: 10, }]}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', borderBottomWidth: 0.5, borderBottomColor: 'grey', padding: 10 }}>{user.name}</Text>
            <Text style={{ fontSize: 14, lineHeight: 25, padding: 10 }}>{user.address}</Text>
          </View>
        </View>

        {/* Delivery method */}
        <View style={{ justifyContent: 'space-between', marginTop: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, fontWeight: '300' }}>Delivery method</Text>
            <Image
              source={require('../../../../assets/images/edit.png')}
              style={{ width: 20, height: 20, resizeMode: 'contain' }}
            />

          </View>
          <View style={[styles.box, { borderRadius: 8, paddingVertical: 10, flexDirection: 'row', }]}>
            <Image source={{ uri: 'https://theme.hstatic.net/200000472237/1000829412/14/logo.png?v=584' }}
              style={{ height: 20, width: 90, margin: 10 }} />
            <Text style={{ margin: 10, fontSize: 14, fontWeight: 'bold' }}>Fast (2-3 days)</Text>
          </View>
        </View>

        {/* Total price */}
        <View style={[styles.box, { padding: 10, borderRadius: 8, height: 125, justifyContent: 'space-between', marginTop: 30, marginBottom: 30, }]}>
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
        <TouchableOpacity onPress={() => gotoSuccess()} style={{ backgroundColor: '#000', height: 60, borderRadius: 8, flexDirection: 'column', justifyContent: 'center' }}>
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
    shadowRadius: 5,
    shadowOpacity: 0.3
  }
})