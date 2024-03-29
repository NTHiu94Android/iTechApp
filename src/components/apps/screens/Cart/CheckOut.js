import {
  Image, ScrollView, StyleSheet, Text, TouchableOpacity, View,
  Modal, ActivityIndicator, Alert, TextInput, ToastAndroid
} from 'react-native'
import React, { useContext, useEffect, useState, useRef } from 'react'
import back from '../../../back/back';
import { UserContext } from '../../../users/UserContext';
import { AppContext } from '../../AppContext';

import { WebView } from 'react-native-webview';
import PaypalApi from '../../../../helpers/PaypalApi';
import queryString from 'query-string';
import ProgressDialog from 'react-native-progress-dialog';
import DialogPromotion from './DialogPromotion';

const CheckOut = (props) => {
  const { navigation } = props;
  const { data } = props.route.params;
  back(navigation);
  const { user } = useContext(UserContext);
  const {
    onGetAddressByIdUser, onAddOrder,
    countAddress, onGetSubProducts,
    onUpdateOrderDetail, onUpdateIdOrderOrderDetail,
    countCart, setCountCart,
    onGetPromotions, onUpdatePromotion, onAddPromotion,
    //getOrderByIdUserAndStatus
  } = useContext(AppContext);

  const [isSelect, setIsSelect] = useState('1');

  // Paypal
  const [showGateway, setShowGateway] = useState(false);

  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [dataSend, setDataSend] = useState({});

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [total, setTotal] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);

  const [sale, setSale] = useState(0);
  const [code, setCode] = useState('');
  const [alert, setAlert] = useState(false);

  const [idPromotion, setIdPromotion] = useState('');

  //Show modal
  const [showModal, setShowModal] = useState(false);
  const [listPromotion, setListPromotion] = useState([]);
  const promotionsRef = useRef(null);

  useEffect(() => {
    const getData = async () => {
      getAddress();
      getTotal();
    }
    getData();
  }, [countAddress]);

  useEffect(() => {
    setDataSendToPaypal(totalFinal);
  }, [totalFinal]);


  const getPromotionsByUser = async (total) => {
    const res = await onGetPromotions(user._id);
    const promotions = res.data;
    if (promotions) {
      const day = new Date();
      let list = [];
      for (let i = 0; i < promotions.length; i++) {
        const dateStart = new Date(
          parseInt(promotions[i].dayStart.split("/")[2]),
          parseInt(promotions[i].dayStart.split("/")[1]) - 1, 
          parseInt(promotions[i].dayStart.split("/")[0]) + 1
        );
        const dateEnd = new Date(
          parseInt(promotions[i].dayEnd.split("/")[2]),
          parseInt(promotions[i].dayEnd.split("/")[1]) - 1,
          parseInt(promotions[i].dayEnd.split("/")[0]) + 1
        );
        if (!promotions[i].isSubmit && dateStart <= day && dateEnd >= day && total >= promotions[i].condition) {
          list.push(promotions[i]);
          console.log(`Promotion: ${i} `, promotions[i]);
        }
      }
      console.log(list);
      setListPromotion(list);
      promotionsRef.current = promotions;
    }

  }
  //Check code promotion
  const handleCheckCode = async () => {
    setIsLoading(true);
    //const res = await onGetPromotions(user._id);
    //const promotions = res.data;
    const promotions = promotionsRef.current;
    let check = false;
    const day = new Date();
    if (promotions != null && promotions.length > 0) {
      for (let i = 0; i < promotions.length; i++) {
        const dateStart = new Date(
          parseInt(promotions[i].dayStart.split("/")[2]),
          parseInt(promotions[i].dayStart.split("/")[1]) - 1,
          parseInt(promotions[i].dayStart.split("/")[0]) + 1
        );
        const dateEnd = new Date(
          parseInt(promotions[i].dayEnd.split("/")[2]),
          parseInt(promotions[i].dayEnd.split("/")[1]) - 1,
          parseInt(promotions[i].dayEnd.split("/")[0]) + 1
        );
        if (promotions[i].isSubmit == false && dateStart <= day && dateEnd >= day && promotions[i].code == code && total >= promotions[i].condition) {
          check = true;
          if (total * promotions[i].sale / 100 > promotions[i].maxSale) {
            setSale(promotions[i].maxSale);
            setTotalFinal((total - promotions[i].maxSale).toFixed(2));
          } else {
            setSale(promotions[i].sale);
            setTotalFinal((total - total * promotions[i].sale / 100).toFixed(2));
          }
          setIdPromotion(promotions[i]._id);
          setAlert(false);
          break;
        }
      }
      if (check == false) {
        setAlert(true);
        setSale(0);
        setTotalFinal(total);
      }
    }
    setIsLoading(false);

  };

  //Lay data gui len server
  const setDataSendToPaypal = (totalFinal) => {
    //let list = [];
    // for (let i = 0; i < data.listCart.length; i++) {
    //   let price = data.listCart[i].subProduct.price;
    //   if (data.listCart[i].subProduct.sale != 0) {
    //     price = price - price * data.listCart[i].subProduct.sale / 100;
    //   }
    //   const item = {
    //     "name": data.listCart[i].product.name,
    //     "color": data.listCart[i].subProduct.color,
    //     "quantity": data.listCart[i].amount.toString(),
    //     "unit_amount": {
    //       "currency_code": "USD",
    //       "value": price.toString()
    //     }
    //   }
    //   //console.log('item: ', item);
    //   total += item.quantity * item.unit_amount.value;
    //   list.push(item);
    // }
    //console.log('total>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>: ', totalFinal);
    const dataS = {
      "intent": "CAPTURE",
      "purchase_units": [
        {
          // "items": list,
          "amount": {
            "currency_code": "USD",
            "value": totalFinal.toString(),
            "breakdown": {
              "item_total": {
                "currency_code": "USD",
                "value": totalFinal.toString()
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
      //console.log('Không có địa chỉ');
      return;
    }
    for (let i = 0; i < addressRes.data.length; i++) {
      //console.log('Địa chỉ: ', addressRes.data[i]);
      if (addressRes.data[i].status == true) {
        //console.log('Địa chỉ: ', addressRes.data[i].body);
        setAddress(addressRes.data[i].body);
        setPhone(addressRes.data[i].numberPhone);
        return;
      }
    }
  };

  //Tinh tong tien
  const getTotal = async () => {
    //Tinh tong tien
    let total2 = 0;
    let numberProduct = 0;
    const resSubProduct = await onGetSubProducts();
    for (let i = 0; i < data.listCart.length; i++) {
      //Kiem tra lai gia tien
      const subProduct = resSubProduct.data.find(item => item._id == data.listCart[i].subProduct._id);
      if (subProduct != undefined) {
        if (subProduct.sale != 0) {
          data.listCart[i].subProduct.price = subProduct.price - subProduct.price * subProduct.sale / 100;
        } else {
          data.listCart[i].subProduct.price = subProduct.price;
        }
        total2 += data.listCart[i].amount * data.listCart[i].subProduct.price;
      }
      numberProduct += data.listCart[i].amount;

    };
    data.numberProduct = numberProduct;
    //console.log('numberProduct: ', numberProduct);

    setTotal(total2.toFixed(2));
    setTotalFinal(total2.toFixed(2));
    setDataSendToPaypal(total2.toFixed(2));
    setIsLoading(false);

    //Lay danh sach khuyen mai theo gia tri gio hang
    getPromotionsByUser(total2.toFixed(2));
  };

  //Xu ly thanh toan
  const gotoSuccess = async () => {
    try {
      setIsLoading(true);
      //Lay dia chi
      if (address == null || address == undefined || address == '') {
        console.log('Không có địa chỉ');
        const listAddress = [];
        navigation.navigate('Shipping', {listAddress});
        return;
      }
      //Lay ngay hien tai
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const orderDate = `${day}/${month}/${year}`;
      const orderDate2 = `${day + 10}/${month}/${year}`;
      const status = "Processing";
      let paymentMethod = '';
      isSelect == '1' ? paymentMethod = 'Cash on delivery' : paymentMethod = 'Paypal';

      //kiem tra lai gia tien lai gia tien
      let total2 = 0;
      const resSubProduct = await onGetSubProducts();
      for (let i = 0; i < data.listCart.length; i++) {
        const subProduct = resSubProduct.data.find(item => item._id == data.listCart[i].subProduct._id);
        if (subProduct != undefined) {
          if (subProduct.sale != 0) {
            data.listCart[i].subProduct.price = subProduct.price - subProduct.price * subProduct.sale / 100;
          } else {
            data.listCart[i].subProduct.price = subProduct.price;
          }
          total2 += data.listCart[i].amount * data.listCart[i].subProduct.price;
        }

      };

      console.log('Total ----- Total2: ', total, ' ----- ', total2);
      if (total2.toFixed(2) != total) {
        Alert.alert('Price has changed');
        setIsLoading(false);
        setCountCart(countCart + 1);
        navigation.navigate('Cart');
        return;
      }

      //Xu ly thanh toan
      if (isSelect == '2') {
        setDataSendToPaypal(totalFinal);
        await pay();
      } else {
        //Them don hang
        //dateCreate, datePayment, totalPrice, status, paymentMethod, address, idUser

        let res = null;
        if (sale == 0) {
          res = await onAddOrder(orderDate, "", total, status, paymentMethod, address, user._id);
        } else {
          res = await onAddOrder(orderDate, "", totalFinal, status, paymentMethod, address, user._id);
        }

        if (res.data != undefined) {
          //Xoa gio hang
          handleDleteOrderDetail(data.listCart, res.data._id);
          //Cap nhat lai trang thai promotion
          await onUpdatePromotion(idPromotion, true);
          //Them promotion cho don hang gia tri lon hon 300
          //content, sale,  maxSale, code, dayStart, dayEnd, condition, idUser
          if (totalFinal > 300) {
            const random = Math.floor(Math.random() * 10000);
            //console.log('Random: ', random);
            const res = await onAddPromotion('Discount 10% for next order', 10, 20, 'DISCOUNT' + random, orderDate, orderDate2, 300, user._id);
            if (res.data != undefined) {
              ToastAndroid.show('Discount 10% for next order', ToastAndroid.SHORT);
            }
          } else if (totalFinal > 500) {
            const random = Math.floor(Math.random() * 10000);
            //console.log('Random: ', random);
            const res = await onAddPromotion('Discount 20% for next order', 20, 30, 'DISCOUNT' + random, orderDate, orderDate2, 500, user._id);
            if (res.data != undefined) {
              ToastAndroid.show('Discount 20% for next order', ToastAndroid.SHORT);
            }
          } else if (totalFinal > 1000) {
            const random = Math.floor(Math.random() * 10000);
            //console.log('Random: ', random);
            const res = await onAddPromotion('Discount 30% for next order', 30, 50, 'DISCOUNT' + random, orderDate, orderDate2, 1000, user._id);
            if (res.data != undefined) {
              ToastAndroid.show('Discount 30% for next order', ToastAndroid.SHORT);
            }
          }
          //await getOrderByIdUserAndStatus(user);
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
      //console.log("Res generateToken: ", access_token);
      //console.log("Res createOrder: ", res);

      if (res != null || res != undefined) {
        const findUrl = res.links.find(data => data?.rel === 'approve');
        console.log("findUrl: ", findUrl);
        setLink(findUrl.href);
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Error pay screen: ", error);
      setIsLoading(false);
      setShowGateway(false);
    }
  };

  //Dieu huong sang trang thanh toan paypal
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

  //Thanh toan paypal thanh cong
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
          const orderDate2 = `${day + 10}/${month}${year}`;
          const status = "Processing";
          const paymentMethod = 'Paypal';

          //Them don hang
          //dateCreate, datePayment, totalPrice, status, paymentMethod, address, idUse
          const res = await onAddOrder(orderDate, orderDate, totalFinal, status, paymentMethod, address, user._id);
          if (res != null || res != undefined) {
            console.log("Res add order: ", res.data);

            //Cap nhat lai trang thai promotion
            await onUpdatePromotion(idPromotion, true);

            if (totalFinal > 300) {
              const random = Math.floor(Math.random() * 10000);
              //console.log('Random: ', random);
              const res = await onAddPromotion('Discount 10% for next order', 10, 20, 'DISCOUNT' + random, orderDate, orderDate2, 300, user._id);
              if (res.data != undefined) {
                ToastAndroid.show('Discount 10% for next order', ToastAndroid.SHORT);
              }
            } else if (totalFinal > 500) {
              const random = Math.floor(Math.random() * 10000);
              //console.log('Random: ', random);
              const res = await onAddPromotion('Discount 20% for next order', 20, 30, 'DISCOUNT' + random, orderDate, orderDate2, 500, user._id);
              if (res.data != undefined) {
                ToastAndroid.show('Discount 20% for next order', ToastAndroid.SHORT);
              }
            } else if (totalFinal > 1000) {
              const random = Math.floor(Math.random() * 10000);
              //console.log('Random: ', random);
              const res = await onAddPromotion('Discount 30% for next order', 30, 50, 'DISCOUNT' + random, orderDate, orderDate2, 1000, user._id);
              if (res.data != undefined) {
                ToastAndroid.show('Discount 30% for next order', ToastAndroid.SHORT);
              }
            }

            //Xoa gio hang
            const list = data.listCart;
            handleDleteOrderDetail(list, res.data._id);

            //await getOrderByIdUserAndStatus(user);
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
  const handleDleteOrderDetail = async (list, idOrder) => {
    try {
      for (let i = 0; i < list.length; i++) {
        await onUpdateIdOrderOrderDetail(list[i]._id, idOrder);
      }
      setCountCart(countCart - 1);
    } catch (error) {
      console.log("Error handleDleteOrderDetail: ", error);
    }
  };

  const showDialogListPromotion = () => {
    setShowModal(true);

  }

  const handleSelectPromotion = (item) => {
    setShowModal(false);
    setCode(item.code);
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 12, justifyContent: 'space-between', backgroundColor: 'white' }}>

      <ProgressDialog
        visible={isLoading}
        loaderColor="black"
        lable="Please wait..."
      />

      {
        showModal ?
          <DialogPromotion
            showModal={showModal}
            handleSelectPromotion={handleSelectPromotion}
            listPromotion={listPromotion}
            cancel={() => setShowModal(false)}
          /> : null
      }

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
            <TouchableOpacity onPress={() => navigation.navigate('ShippngAdress')}>
              <Image
                source={require('../../../../assets/images/edit.png')}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.box, { backgroundColor: '#fff', borderRadius: 8, paddingVertical: 10, }]}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', borderBottomWidth: 0.5, borderBottomColor: 'grey', padding: 10 }}>
              {user.name}
            </Text>
            <Text style={{ fontSize: 14, lineHeight: 25, padding: 10, fontWeight: '500' }}>Phone: {phone}</Text>
            <Text style={{ fontSize: 14, marginHorizontal: 10, marginBottom: 10, fontWeight: '500' }}>Address: {address}</Text>
          </View>
        </View>

        {/* Payment method */}
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

        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 12, }}>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 8, width: '80%', paddingHorizontal: 8, position: 'relative' }}
            onChangeText={text => setCode(text)}
            value={code}
            placeholder='Enter code promotion'
          />
          {/* {
            listPromotion.length > 0 ?
               : null
          } */}
          <TouchableOpacity onPress={() => showDialogListPromotion()}>
                <Image
                  source={require('../../../../assets/images/down1.png')}
                  style={{ width: 20, height: 20, position: 'absolute', right: 10, top: -10 }}
                />
              </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleCheckCode()}
            style={{ backgroundColor: 'black', padding: 10, borderRadius: 8, marginLeft: 10 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Check</Text>
          </TouchableOpacity>
        </View>

        {
          alert == true ?
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ color: 'red', fontWeight: 'bold', fontStyle: 'italic' }}>Code is not correct !</Text>
            </View> : null
        }

        {/* Total price */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: 'black' }}>Infomation & order</Text>
        </View>
        <View style={[styles.box, { padding: 10, borderRadius: 8, justifyContent: 'space-between', marginBottom: 20, }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>The number of products:</Text>
            <Text style={{ fontSize: 16, fontWeight: '300' }}>{data.numberProduct} (Product)</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>Total(provisional):</Text>
            <Text style={{ fontSize: 16, fontWeight: '300', color: 'black' }}>$ {total}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>Promotion:</Text>
            <Text style={{ fontSize: 16, fontWeight: '300' }}>{(totalFinal - total).toFixed(2)} $</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>Total:</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: 'black' }}>$ {totalFinal}</Text>
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity
          onPress={() => gotoSuccess()}
          style={{ backgroundColor: '#000', height: 50, borderRadius: 30, flexDirection: 'column', justifyContent: 'center' }}>
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