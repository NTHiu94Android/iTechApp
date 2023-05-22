import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, ActivityIndicator, alert, Alert } from 'react-native'
import React, { useContext, useEffect, useState, useRef } from 'react'
import back from '../../../back/back';
import { UserContext } from '../../../users/UserContext';
import { AppContext } from '../../AppContext';

import { WebView } from 'react-native-webview';
import PaypalApi from '../../../../helpers/PaypalApi';
import queryString from 'query-string';
import ProgressDialog from 'react-native-progress-dialog';

const CheckOut = (props) => {
  const { navigation } = props;
  const { data } = props.route.params;
  back(navigation);
  const { user } = useContext(UserContext);
  const {
    onGetAddressByIdUser, onAddOrder,
    countAddress,
    onDeleteOrderDetail,
    countCart, setCountCart,
  } = useContext(AppContext);

  const [isSelect, setIsSelect] = useState('1');

  // Paypal
  const [showGateway, setShowGateway] = useState(false);

  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [dataSend, setDataSend] = useState({});

  const [address, setAddress] = useState('');

  useEffect(() => {
    setDataSendToPaypal();
  }, []);

  useEffect(() => {
    getAddress();
  }, [countAddress]);

  //Lay data gui len server
  const setDataSendToPaypal = () => {
    let list = [];
    let total = 0;
    for (let i = 0; i < data.listCart.length; i++) {
      let price = data.listCart[i].subProduct.price;
      if (data.listCart[i].subProduct.sale != 0) {
        price = price - price * data.listCart[i].subProduct.sale / 100;
      }
      const item = {
        "name": data.listCart[i].product.name,
        "color": data.listCart[i].subProduct.color,
        "quantity": data.listCart[i].amount.toString(),
        "unit_amount": {
          "currency_code": "USD",
          "value": price.toString()
        }
      }
      //console.log('item: ', item);
      total += item.quantity * item.unit_amount.value;
      list.push(item);
    }

    const dataS = {
      "intent": "CAPTURE",
      "purchase_units": [
        {
          // "items": list,
          "amount": {
            "currency_code": "USD",
            "value": total.toString(),
            "breakdown": {
              "item_total": {
                "currency_code": "USD",
                "value": total.toString()
              }
            }
          }
        }
      ],
      "application_context": {
        "return_url": "https://example.com/return",
        "cancel_url": "https://example.com/cancel"
      }
    };
    setDataSend(dataS);
  };

  //Lay dia chi
  const getAddress = async () => {
    const addressRes = await onGetAddressByIdUser(user._id);
    if (addressRes.data == undefined) {
      console.log('Không có địa chỉ');
      return;
    }
    for (let i = 0; i < addressRes.data.length; i++) {
      console.log('Địa chỉ: ', addressRes.data[i]);
      if (addressRes.data[i].status == true) {
        console.log('Địa chỉ: ', addressRes.data[i].body);
        setAddress(addressRes.data[i].body);
        return;
      }
    }
  };

  //Xu ly thanh toan
  const gotoSuccess = async () => {
    try {
      setIsLoading(true);
      //Lay dia chi
      if (address == null || address == undefined || address == '') {
        console.log('Không có địa chỉ');
        navigation.navigate('Shipping');
        return;
      }
      //Lay ngay hien tai
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const orderDate = `${day}/${month}/${year}`;
      const status = "Processing";
      let paymentMethod = '';
      isSelect == '1' ? paymentMethod = 'Cash on delivery' : paymentMethod = 'Paypal';

      //Xu ly thanh toan
      if (isSelect == '2') {
        await pay();
      } else {
        //Tinh tong tien
        let total = 0;
        for (let i = 0; i < data.listCart.length; i++) {
          let price = data.listCart[i].subProduct.price;
          if (data.listCart[i].subProduct.sale != 0) {
            price = price - price * data.listCart[i].subProduct.sale / 100;
          }
          total += data.listCart[i].amount * price;
        }
        //Them don hang
        //dateCreate, datePayment, totalPrice, status, paymentMethod, address, idUser
        const res = await onAddOrder(orderDate, "", total, status, paymentMethod, address, user._id);
        console.log("Res add order: ", res.data);
        if (res) {
          //Xoa gio hang
          handleDleteOrderDetail(data.listCart);
          navigation.navigate('Success');
        } else {
          Alert.alert('Payment failed');
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log("Error gotoSuccess: ", error);
    }

  };

  //Paypal
  const pay = async () => {
    try {
      setShowGateway(true);
      const access_token = await PaypalApi.generateToken();
      setToken(access_token);
      const res = await PaypalApi.createOrder(access_token, dataSend);
      console.log("Res generateToken: ", access_token);
      console.log("Res createOrder: ", res);

      if (res != null || res != undefined) {
        const findUrl = res.links.find(data => data?.rel === 'approve');
        console.log("findUrl: ", findUrl);
        setLink(findUrl.href);
      }
    } catch (error) {
      console.log("Error pay screen: ", error);
      setIsLoading(false);
      setShowGateway(false);
    }
  };

  const onUrlChange = (webviewState) => {
    //console.log("webviewState: ", webviewState);
    if (webviewState.url.includes('https://example.com/cancel')) {
      setShowGateway(false);
      clearPaypalState();
      console.log("Payment cancelled");
    }
    if (webviewState.url.includes('https://example.com/return')) {
      setShowGateway(false);
      const urlValue = queryString.parseUrl(webviewState.url);
      console.log("UrlValue: ", urlValue);
      const id = urlValue.query.token;

      if (id != null || id != undefined) {
        paymentSuccess(id);
      }
    }
  };

  const paymentSuccess = async (id) => {
    try {
      const res = await PaypalApi.capturePayment(id, token);
      if (res != null || res != undefined) {
        if (res.status === 'COMPLETED') {
          console.log("Payment success");
          //Lay ngay hien tai
          const date = new Date();
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const orderDate = `${day}/${month}/${year}`;
          const status = "Processing";
          const paymentMethod = 'Paypal';
          //Tinh tong tien
          let total = 0;
          for (let i = 0; i < data.listCart.length; i++) {
            let price = data.listCart[i].subProduct.price;
            if (data.listCart[i].subProduct.sale != 0) {
              price = price - price * data.listCart[i].subProduct.sale / 100;
            }
            total += data.listCart[i].amount * price;
          }
          //Them don hang
          //dateCreate, datePayment, totalPrice, status, paymentMethod, address, idUse
          const res = await onAddOrder(orderDate, orderDate, total, status, paymentMethod, address, user._id);
          if (res != null || res != undefined) {
            console.log("Res add order: ", res.data);

            //Xoa gio hang
            const list = data.listCart;
            handleDleteOrderDetail(list);

            //Chuyen sang trang success
            navigation.navigate('Success');
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log("Error paymentSuccess: ", error);
    }
  };

  const clearPaypalState = () => {
    setLink(null);
    setToken(null);
  };

  const handleSelected = (id) => {
    setIsSelect(id);
  }

  //Xoa gio hang
  const handleDleteOrderDetail = async (list) => {
    try {
      for (let i = 0; i < list.length; i++) {
        await onDeleteOrderDetail(list[i]._id);
      }
      await onDeleteOrderDetail();
      setCountCart(countCart-1);
    } catch (error) {
      console.log("Error handleDleteOrderDetail: ", error);
    }
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 12, justifyContent: 'space-between', backgroundColor: 'white' }}>

      <ProgressDialog
        visible={isLoading}
        loaderColor="black"
        lable="Please wait..."
      />

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
            <Text style={{ fontSize: 14, lineHeight: 25, padding: 10, fontWeight: '400' }}>Phone: {user.numberPhone}</Text>
            <Text style={{ fontSize: 14, marginHorizontal: 10, marginBottom: 10, fontWeight: '400' }}>Address: {address}</Text>
          </View>
        </View>

        {/* Delivery method */}
        <View style={{ justifyContent: 'space-between', marginTop: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: 'black' }}>Payment method</Text>
            <View style={{ width: 20, height: 20 }} />

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

        {showGateway ? (
          <Modal
            visible={showGateway}
            onDismiss={() => setShowGateway(false)}
            onRequestClose={() => setShowGateway(false)}
            animationType={'fade'}
            transparent>
            <View style={styles.webViewCon}>
              <View style={styles.wbHead}>
                <TouchableOpacity
                  style={{ padding: 13 }}
                  onPress={() => setShowGateway(false)}>
                  {/* <Feather name={'x'} size={24} /> */}
                  <Image
                    style={{ height: 20, width: 20 }}
                    resizeMode='cover'
                    source={require('../../../../assets/images/back.png')} />
                </TouchableOpacity>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#00457C',
                  }}>
                  PayPal GateWay
                </Text>
                <View style={{ padding: 13, opacity: 1 }}>
                  <ActivityIndicator size={24} color={'#000'} />
                </View>
              </View>
              {link != null ?
                <WebView
                  source={{ uri: link }}
                  onNavigationStateChange={onUrlChange}
                  style={{ flex: 1 }}
                /> : null
              }

            </View>
          </Modal>
        ) : null}
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
  webViewCon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wbHead: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    zIndex: 25,
    elevation: 2,
  },
})