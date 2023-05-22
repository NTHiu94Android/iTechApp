import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Delivered from './OrderStatus/Delivered';
import Canceled from './OrderStatus/Canceled';
import Processing from './OrderStatus/Processing';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import backToScreen from '../../../back/backToScreen';

const Tab = createMaterialTopTabNavigator();

const Order = (props) => {
  const { navigation } = props;
  backToScreen(navigation, 'BottomNavigation');
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
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
        <Tab.Screen options={{ headerShown: false }} name="Processing" component={Processing} />
        <Tab.Screen options={{ headerShown: false }} name="Delivered" component={Delivered} />
        <Tab.Screen options={{ headerShown: false }} name="Canceled" component={Canceled} />
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