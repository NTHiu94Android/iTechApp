import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../../users/UserContext';
import { AppContext } from '../../AppContext';

import ProgressDialog from 'react-native-progress-dialog';

const OrderDetail = (props) => {
  const { navigation } = props;
  const { item } = props.route.params;
  const { user } = useContext(UserContext);
  const { onGetOrderDetailsByIdOrder, countOrderDetail, onGetProductById, onGetCommentByIdUser, onGetCommentByIdUserAndIdProduct } = useContext(AppContext);

  const [listOrderDetail, setListOrderDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getOrderDetail();
  }, [countOrderDetail]);

  const getOrderDetail = async () => {
    setIsLoading(true);
    const res = await onGetOrderDetailsByIdOrder(item._id);
    for (let i = 0; i < res.length; i++) {
      const product = await onGetProductById(res[i].idProduct);
      const cmt = await onGetCommentByIdUserAndIdProduct(user._id, product._id);
      console.log('cmt: ' + i, cmt);
      if (cmt.length > 0) {
        res[i].isCmt = true;
      } else {
        res[i].isCmt = false;
      }
      res[i].product = product;
      res[i].status = item.status;
    }
    console.log('res list order detail: ', res.cmt);
    if (res != undefined) {
      setListOrderDetail(res);
    } else {
      setListOrderDetail([]);
    }
    setIsLoading(false);
  };

  const gotoComment = (item) => {
    navigation.navigate('Comment', { item });
  };


  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={container}>
        <View style={header}>
          <View style={viewHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                style={icBack}
                source={require('../../../../assets/images/back.png')}
                resizeMode="cover"></Image>
            </TouchableOpacity>
            <Text style={txtOrderDetail}>Order Detail</Text>
          </View>
        </View>

        <ScrollView style={{ flex: 1, backgroundColor: 'white' }} showsVerticalScrollIndicator={false}>
          <View style={body}>
            <View style={viewTxtOrder}>
              <View style={viewOrder}>
                <Text numberOfLines={1} style={txtOrder}>Order No{item._id}</Text>
                <Text>{item.orderDate}</Text>
              </View>
              <View style={[viewDetail,]}>
                <View style={viewTotal}>
                  <Text style={txtTitle}>Total:</Text>
                  <Text style={txtValue} >${item.totalPrice}</Text>
                </View>
                <View style={viewTotal}>
                  <Text style={txtTitle}>Payments:</Text>
                  <Text style={txtValuePayments}>Cash</Text>
                </View>
                <View style={viewStatus}>
                  <Text style={txtTitle}>Status:</Text>
                  {item.status == 'Delivered' && <Text style={txtValueStatus}>{item.status}</Text>}
                  {item.status == 'Canceled' && <Text style={[txtValueStatus, { color: 'red' }]}>{item.status}</Text>}
                  {item.status == 'Confirmed' && <Text style={[txtValueStatus]}>{item.status}</Text>}
                  {item.status == 'Processing' && <Text style={[txtValueStatus, { color: '#FFD700' }]}>{item.status}</Text>}
                </View>
              </View>
            </View>

            {/* view custom */}
            <View style={viewTxtCustom}>
              <View style={viewCustomer}>
                <Text style={txtCustomer}>Customer Information</Text>
              </View>
              <View style={viewInformation}>
                <View style={viewName}>
                  <Text style={txtTitle}>Name:</Text>
                  <Text style={txtValue}>{user.name}</Text>
                </View>
                <View style={viewTotal}>
                  <Text style={txtTitle}>Phone number:</Text>
                  <Text style={txtValue}>{user.numberPhone}</Text>
                </View>
                <View style={viewStatus}>
                  <Text style={txtTitle}>Address:</Text>
                  <Text style={txtValue}>{user.address}</Text>
                </View>
              </View>
            </View>
          </View>


          <View style={footer}>
            <View style={[viewCustomer, { flexDirection: 'column' }]}>
              <Text style={[txtCustomer, { marginBottom: 16, width: '100%' }]}>List product</Text>
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
        title="Đang tải dữ liệu"
        message="Vui lòng đợi trong giây lát..."
      />

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
    paddingStart: 20,
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
    padding: 5, margin: 5
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
    elevation: 5,
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
    flexDirection: 'row',
    color: 'black',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',

  },

  viewTxtCustom: {
    marginHorizontal: 10,
    paddingHorizontal: 5,
    marginTop: 20,
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


  txtValueStatus: {
    flex: 1,
    color: 'green',
    fontSize: 16,
    marginRight: 30,
    marginStart: 15,
  },

  viewStatus: {
    paddingVertical: 15,
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
  },

  viewTotal: {
    paddingTop: 15,
    flexDirection: 'row',
    color: 'black',
    justifyContent: 'space-around',
    paddingVertical: 15,
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
    maxWidth: 200,
  },
  viewOrder: {
    flexDirection: 'row',
    color: 'black',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 18
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
    marginTop: 30
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
    paddingTop: 30,
  },
});

const Item = ({ item, gotoComment }) => {
  console.log("Itemmmmmmmmmmmmmm: ", item.isCmt);
  return (
    <View style={styles.listItem}>
      <View style={{ flexDirection: 'row' }}>
        <Image source={{ uri: item.product.listImage[0] }} style={styles.imgLst} />
        <View style={styles.listItemName}>
          <Text numberOfLines={1} style={styles.TextlstName}>{item.product.name}</Text>
          <Text style={styles.TextlstPrice}>$ {item.product.price} * {item.amount}</Text>
        </View>
      </View>

      <View >
        {
          item.status == 'Delivered' && item.isCmt == false ?
            <TouchableOpacity style={styles.btnReview} onPress={() => gotoComment()}>
              <Text style={styles.textReview}>Review</Text>
            </TouchableOpacity> :
            <TouchableOpacity style={[styles.btnReview, { backgroundColor: '#CCCCCC' }]}>
              <Text style={styles.textReview}>Review</Text>
            </TouchableOpacity>
        }
      </View>

    </View>

  );
};