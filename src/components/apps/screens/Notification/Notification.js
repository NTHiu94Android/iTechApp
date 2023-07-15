import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import back from '../../../back/back';
import { UserContext } from '../../../users/UserContext';
import { AppContext } from '../../AppContext';

import ProgressDialog from 'react-native-progress-dialog';

const Notification = (props) => {
    const { navigation } = props;
    const { user } = useContext(UserContext);
    const { onGetNotifications, onUpdateNotification,
        onGetOrdersByIdUser, onGetOrderDetailByIdOrder,
        onGetSubProductById, onGetProductById
    } = useContext(AppContext);
    back(navigation);

    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFirstRun, setIsFirstRun] = useState(true);

    const getData = async () => {
        try {
            if (isFirstRun) {
                setIsLoading(true);
                setIsFirstRun(false);
            }
            const res = await onGetNotifications(user._id);
            if (res.data) {
                const notifications = res.data;
                setNotifications(notifications);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log("Error getData", error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const onPressItem = async (item) => {
        try {
            setIsLoading(true);
            //console.log("item", item._id);
            //Cat chuoi bat dau tu dau cach thu 2 den dau cah thu 3 trong item.body
            const string = item.body;
            const arrStr = string.split(" ");
            const idOrder = arrStr[1];
            console.log("idOrder", idOrder.trim());
            const resOrder = await onGetOrdersByIdUser(user._id);
            const orders = resOrder.data;
            let order = {};
            for (let i = 0; i < orders.length; i++) {
                if (orders[i]._id == idOrder.trim()) {
                    order = orders[i];
                    break;
                }
            }
            const resOrderDetails = await onGetOrderDetailByIdOrder(idOrder);
            const orderDetails = resOrderDetails.data;
            const resSubProduct = await onGetSubProductById(orderDetails[0].idSubProduct);
            const product = await onGetProductById(resSubProduct.idProduct);
            let sum = 0;
            for (let j = 0; j < orderDetails.length; j++) {
                sum += orderDetails[j].quantity;
            }
            order.quantity = sum;
            order.orderDetails = orderDetails;
            order.product = product;
            order.subProduct = resSubProduct;

            navigation.navigate('OrderDetail', { item: order });
            //Cap nhat lai trang thai da doc
            await onUpdateNotification(item._id);
            getData();
        } catch (error) {
            setIsLoading(false);
            console.log("Error onPressItem", error);
        }
    };

    return (
        <View style={{ position: 'relative', flex: 1, backgroundColor: 'white' }}>
            <ProgressDialog
                visible={isLoading}
                loaderColor="black"
                lable="Please wait..."
            />
            {/* Top bar */}
            <View style={
                {
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    paddingVertical: 6, paddingHorizontal: 12, borderColor: '#ddd', borderBottomWidth: 1
                }
            }>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        style={{ width: 22, height: 22 }}
                        resizeMode='cover'
                        source={require('../../../../assets/images/back.png')} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
                    <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>Notification</Text>
                </View>

                <View style={{ width: 22, height: 22 }}></View>
            </View>



            <FlatList
                data={notifications}
                renderItem={({ item }) =>
                    <Item item={item} onPress={() => onPressItem(item)} />
                }

                showsVerticalScrollIndicator={false}
                keyExtractor={item => item._id}
            />
        </View>
    )
}

export default Notification

const styles = StyleSheet.create({
    container1: {
        flexDirection: 'row', padding: 12, borderColor: '#ddd', borderWidth: 1, marginHorizontal: 12, marginTop: 8, borderRadius: 8,
        //Box shadow
    },
    container2: {
        flexDirection: 'row', padding: 12, borderColor: '#ddd', borderWidth: 1, marginHorizontal: 12, marginTop: 8, borderRadius: 8,
        //Box shadow
    },
});

const Item = ({ item, onPress }) => {
    const { title, body, isCheck, createdAt, image } = item;
    const strDate = createdAt.split('T')[0];
    //console.log('item: ', item);

    return (

        <TouchableOpacity onPress={onPress}>
            <View style={isCheck ? styles.container1 : styles.container2}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Image
                        style={{ width: 50, height: 50, borderRadius: 8, }}
                        resizeMode='cover'
                        source={require('../../../../assets/images/ic-bell.png')}
                    />
                    <View style={{ width: '85%', paddingLeft: 12 }}>
                        {
                            isCheck === false ?
                                <View>
                                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                        <Text style={{ color: 'black', fontWeight: '800', fontSize: 16 }}>{title}</Text>
                                        <Text style={{ color: 'red', fontWeight: '800', fontSize: 12, marginRight: 10 }}>Unread</Text>
                                    </View>
                                    <Text style={{ color: 'black', fontWeight: '600', fontSize: 14 }}>{body}</Text>
                                    <Text style={{ color: 'black', fontWeight: '800', fontSize: 12, alignSelf: 'flex-end', marginRight: 10 }}>{strDate}</Text>
                                </View> :
                                <View>
                                    <Text style={{ color: 'black', fontWeight: '400', fontSize: 16 }}>{title}</Text>
                                    <Text style={{ color: 'black', fontWeight: '300', fontSize: 14 }}>{body}</Text>
                                    <Text style={{ color: 'black', fontWeight: '400', fontSize: 12, alignSelf: 'flex-end', marginRight: 10 }}>{strDate}</Text>
                                </View>

                        }



                    </View>

                </View>
            </View>
        </TouchableOpacity>
    )
};