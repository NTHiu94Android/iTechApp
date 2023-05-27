import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import backToScreen from '../../../back/backToScreen';

const Success = (props) => {
  const { navigation } = props;
  backToScreen(navigation, 'BottomNavigation');
  return (
    <View style={{ padding: 30, flex: 1, flexDirection: 'column', justifyContent: 'space-evenly' }}>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 36, fontWeight: 'bold' }}>SUCCESS!</Text>
        <Image source={{ uri: 'https://giaohangtietkiem.vn/wp-content/uploads/2021/07/services_image.png' }}
          style={{ width: 200, height: 200 }} />
        <View>
          <Text style={{ fontSize: 18 }}>Your order will be delivered soon.</Text>
          <Text style={{ fontSize: 18 }}>Thank you for choosing our app!</Text>
        </View>
      </View>
      <View style={{ justifyContent: 'space-between', height: 150 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Order")}
          style={{ backgroundColor: '#000', height: 50, borderRadius: 30, justifyContent: 'center' }}>
          <Text style={{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Track your orders</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Success

const styles = StyleSheet.create({})