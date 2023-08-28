import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../../users/UserContext';
import { AppContext } from '../../AppContext';

import ProgressDialog from 'react-native-progress-dialog';
import back from '../../../back/back';

const OrderDetail = (props) => {
  const { navigation } = props;
  back(navigation);
  const { item } = props.route.params;

  const { user } = useContext(UserContext);
  const { onGetSubProductById, 
    onGetProductById, countOrderDetail, 
    onGetOrderDetailByIdOrder,
    onGetSubProducts,
    onGetProducts
  } = useContext(AppContext);

  const [listOrderDetail, setListOrderDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getOrderDetail = async () => {
      setIsLoading(true);
      //Xu ly lay list order detail
      const resOrderDetails = await onGetOrderDetailByIdOrder(item._id);
      const list = resOrderDetails.data;
      //const list = item.orderDetails;
      for (let i = 0; i < list.length; i++) {
        const resSubProducts = await onGetSubProductById(list[i].idSubProduct);
        const product = await onGetProductById(resSubProducts.idProduct);
        list[i].product = product;
        list[i].subProduct = resSubProducts;
        list[i].status = item.status;
      }
      setListOrderDetail(list);
      setIsLoading(false);
    };
    getOrderDetail();
  }, [countOrderDetail]);



  const gotoComment = (item) => {
    navigation.navigate('AddReview', { item });
  };


  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
        <View style={
          {
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            paddingTop: 6, paddingHorizontal: 12, borderColor: '#ddd', borderBottomWidth: 1
          }
        }>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={{ width: 22, height: 22 }}
              resizeMode='cover'
              source={require('../../../../assets/images/back.png')} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
            <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>Order Detail</Text>
          </View>
          <View style={{ width: 22, height: 22 }} />
        </View>

        <ScrollView style={{ flex: 1, backgroundColor: 'white' }} showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <View style={styles.viewTxtOrder}>
              <View style={styles.viewOrder}>
                <Text numberOfLines={1} style={styles.txtOrder}>Order No: {item._id}</Text>
                <Text>{item.orderDate}</Text>
              </View>
              <View style={[styles.viewDetail,]}>
                <View style={styles.viewTotal}>
                  <Text style={styles.txtTitle}>Total:</Text>
                  <Text style={styles.txtValue} >${item.totalPrice}</Text>
                </View>
                <View style={styles.viewTotal}>
                  <Text style={styles.txtTitle}>Date create:</Text>
                  <Text style={styles.txtValue} >{item.dateCreate}</Text>
                </View>
                <View style={styles.viewTotal}>
                  <Text style={styles.txtTitle}>Quantity:</Text>
                  <Text style={styles.txtValue} >{item.quantity} Product</Text>
                </View>
                <View style={styles.viewTotal}>
                  <Text style={styles.txtTitle}>Payments:</Text>
                  <Text style={styles.txtValuePayments}>{item.paymentMethod}</Text>
                </View>
                <View style={styles.viewStatus}>
                  <Text style={styles.txtTitle}>Status:</Text>
                  {item.status == 'Delivered' && <Text style={styles.txtValueStatus}>{item.status}</Text>}
                  {item.status == 'Canceled' && <Text style={[styles.txtValueStatus, { color: 'red' }]}>{item.status}</Text>}
                  {item.status == 'Confirmed' && <Text style={[styles.txtValueStatus]}>{item.status}</Text>}
                  {item.status == 'Processing' && <Text style={[styles.txtValueStatus, { color: '#FFD700' }]}>{item.status}</Text>}
                </View>
              </View>
            </View>

            {/* view custom */}
            <View style={styles.viewTxtCustom}>
              <View style={styles.viewCustomer}>
                <Text style={styles.txtCustomer}>Customer Information</Text>
              </View>
              <View style={styles.viewInformation}>
                <View style={styles.viewName}>
                  <Text style={styles.txtTitle}>Name:</Text>
                  <Text style={styles.txtValue}>{user.name}</Text>
                </View>
                <View style={styles.viewTotal}>
                  <Text style={styles.txtTitle}>Phone number:</Text>
                  <Text style={styles.txtValue}>{user.numberPhone}</Text>
                </View>
                <View style={styles.viewStatus}>
                  <Text style={styles.txtTitle}>Address:</Text>
                  <Text style={styles.txtValue}>{item.address}</Text>
                </View>
              </View>
            </View>
          </View>


          <View style={styles.footer}>
            <View style={[styles.viewCustomer, { flexDirection: 'column' }]}>
              <Text style={[styles.txtCustomer, { marginBottom: 16, width: '100%' }]}>List product</Text>
              {
                listOrderDetail.length > 0 &&
                listOrderDetail.map((item) => <Item key={item._id} item={item} gotoComment={() => gotoComment(item)} />)
              }
            </View>
          </View>
        </ScrollView>
      </View>

      <ProgressDialog
        visible={isLoading}
        loaderColor="black"
        label="Please wait..." />

    </View>
  )
}

export default OrderDetail

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderBottomWidth: 0.5,
    // borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  imgLst: {
    width: 70,
    height: 70,
    borderRadius: 10,
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
  listItemIcon: {
    flex: 1,
    justifyContent: 'space-between',
  },
  btnReview: {
    backgroundColor: 'black',
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  textReview: {
    color: 'white',
    fontSize: 14,
  },
  /* footer */

  footer: {
    marginHorizontal: 10,
    paddingHorizontal: 5,
    borderRadius: 4,
    elevation: 10,
    shadowOffset: {
      width: 1,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    marginBottom: 6,
  },
  /*
  */

  /* body */

  txtName: {
    fontSize: 16,
    marginRight: 30,
    fontSize: 16,
  },

  viewName: {
    paddingTop: 15,
    flexDirection: 'row',
    color: 'black',
    justifyContent: 'space-around',
    backgroundColor: 'white',

  },
  viewInformation: {
    marginTop: 1,
    backgroundColor: 'white',
  },

  txtCustomer: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
    alignItems: 'flex-start',
  },
  viewCustomer: {
    padding: 18,
    paddingBottom: 0,
    flexDirection: 'row',
    color: 'black',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',

  },

  viewTxtCustom: {
    marginHorizontal: 10,
    paddingHorizontal: 5,
    borderRadius: 4,
    elevation: 10,
    shadowOffset: {
      width: 1,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    marginBottom: 6,
  },


  txtValueStatus: {
    flex: 1,
    color: 'green',
    fontSize: 16,
    marginRight: 30,
    marginStart: 15,
  },

  viewStatus: {
    marginBottom: 20,
    marginTop: 8,
    flexDirection: 'row',
    color: 'black',
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },


  txtValuePayments: {
    flex: 1,
    color: 'black',
    fontSize: 16,
    marginRight: 30,
    marginStart: 15,
  },

  txtValue: {
    flex: 1,
    fontSize: 16,
    marginRight: 30,
    marginStart: 15,
  },
  txtTitle: {
    flex: 1,
    fontSize: 16,
    marginRight: 30,
    marginStart: 15,
    color: 'black',
    fontWeight: '600'
  },

  viewTotal: {
    paddingTop: 8,
    flexDirection: 'row',
    color: 'black',
    justifyContent: 'space-around',
    flexDirection: 'row',
    color: 'black',
    justifyContent: 'space-around',
    backgroundColor: 'white',

  },
  viewDetail: {
    marginTop: 1,
  },

  txtOrder: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
    alignItems: 'flex-start',
    marginRight: 30,
  },
  viewOrder: {
    flexDirection: 'row',
    color: 'black',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 18,
    paddingBottom: 8,
  },

  viewTxtOrder: {
    marginHorizontal: 10,
    paddingHorizontal: 5,
    borderRadius: 4,
    elevation: 5,
    shadowOffset: {
      width: 1,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    marginBottom: 6,
  },

  body: {
    marginTop: 20
  },

  /*
   */

  /* header */
  txtOrderDetail: {
    color: 'black',
    fontSize: 18,
    fontWeight: '800',
    marginStart: 70,
  },
  icBack: {
    width: 16,
    height: 16,
    marginEnd: 50,
  },
  viewHeader: {
    flexDirection: 'row',
    marginStart: 15,
    marginTop: 15,
  },
  header: {
    marginBottom: 12,
  },
  /*
   */
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

const Item = ({ item, gotoComment }) => {
  //console.log('Item render: ', item);
  return (
    <View style={styles.listItem}>
      <View style={{ flexDirection: 'row' }}>
        <Image source={{ uri: item.product.image }} style={styles.imgLst} />
        <View style={styles.listItemName}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text numberOfLines={1} style={{ color: 'black', fontSize: 16, fontWeight: '800', maxWidth: 180 }}>{item.product.name}</Text>
              <Text style={styles.TextlstPrice}>Color: {item.subProduct.color}</Text>
            </View>
            <View style={{}}>
              {
                item.status == 'Delivered' && item.isCmt == false ?
                  <TouchableOpacity style={styles.btnReview} onPress={gotoComment}>
                    <Text style={styles.textReview}>Review</Text>
                  </TouchableOpacity> :
                  null
              }
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
            <Text style={styles.TextlstPrice}>$ {item.price}</Text>
            <Text style={styles.TextlstPrice}>Quantity: {item.quantity}</Text>
          </View>
        </View>
      </View>



    </View>

  );
};