import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import back from '../../../back/back';
import { UserContext } from '../../../users/UserContext';
import { AppContext } from '../../AppContext';

import ProgressDialog from 'react-native-progress-dialog';

const ShippngAdress = (props) => {
    const { navigation } = props;
    back(navigation);
    const { user } = useContext(UserContext);
    const {
        onGetAddressByIdUser, onUpdateAddress, onDeleteAddress,
        countAddress, setCountAddress
    } = useContext(AppContext);

    const [listAddress, setListAddress] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getListAddress = async () => {
            setIsLoading(true);
            try {
                const res = await onGetAddressByIdUser(user._id);
                console.log('getListAddress res: ', res);
                if (res.data != undefined) {
                    setListAddress(res.data);
                }
                //setListAddress(data);
            } catch (error) {
                console.log('getListAddress error: ', error);
            }
            setIsLoading(false);
        };
        getListAddress();
    }, [countAddress]);

    //Cap nhat dia chi mac dinh
    const onUpdateDefaultAddress = async (idAddress) => {
        setIsLoading(true);
        for (let i = 0; i < listAddress.length; i++) {
            if (listAddress[i]._id == idAddress) {
                await onUpdateAddress(idAddress, listAddress[i].body, true, listAddress[i].numberPhone, user._id);
            } else {
                await onUpdateAddress(listAddress[i]._id, listAddress[i].body, false, listAddress[i].numberPhone, user._id);
            }
        }
        setCountAddress(countAddress + 1);
    };

    //Xoa dia chi
    const onDeleteAddressById = async (idAddress) => {
        setIsLoading(true);
        for (let i = 0; i < listAddress.length; i++) {
            if (listAddress[i]._id == idAddress && listAddress[i].status == true) {
                await onUpdateDefaultAddress(listAddress[0]._id);
                break;
            }
        }
        await onDeleteAddress(idAddress);
        setCountAddress(countAddress + 2);
    };

    return (
        <View style={styleShippingAddress.container}>

            <ProgressDialog
                visible={isLoading}
                loaderColor="black"
                lable="Please wait..."
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        style={{ width: 22, height: 22 }}
                        resizeMode='cover'
                        source={require('../../../../assets/images/back.png')} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
                    <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>Shipping address</Text>

                </View>

                <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
                    <View style={{ width: 22, height: 22 }} />
                </TouchableOpacity>
            </View>

            <View style={styleShippingAddress.body}>

                {
                    listAddress.map((item, index) => {
                        return <Item
                            key={index}
                            item={item}
                            user={user}
                            onUpdateDefaultAddress={onUpdateDefaultAddress}
                            onDeleteAddressById={onDeleteAddressById}
                            navigation={navigation}
                            listAddress={listAddress}
                        />
                    })
                }

                <View style={styleShippingAddress.floatBox} >
                    <TouchableOpacity onPress={() => navigation.navigate("Shipping", {listAddress})}>
                        <Image
                            style={styleShippingAddress.icAdd}
                            source={require('../../../../assets/images/add.png')}
                            resizeMode='cover'
                        ></Image>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}

export default ShippngAdress

const styleShippingAddress = StyleSheet.create({
    // container
    container: {
        display: 'flex',
        backgroundColor: 'white',
        width: '100%',
        height: '100%'
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    icBack: {
        width: 20,
        height: 20,
    },

    DetailTxt: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        width: '70%'
    },

    //body
    body: {
        backgroundColor: '#F5F5F5',
        height: '100%',
        width: '100%'
    },

    input: {
        width: '90%',
        height: 150,
        marginLeft: 20,
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        justifyContent: 'center'
    },

    txt01: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    txt02: {
        marginTop: 10,
    },

    txt1: {
        fontWeight: '500',
        color: 'black'
    },

    txt2: {
        color: 'red',
        marginLeft: 10
    },

    //CheckBOx
    checkbox: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },

    Box: {
        width: 25,
        height: 25,
        header: 25,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 5,
        marginRight: 5
    },

    BoxChecked: {
        width: 25,
        height: 25,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 5,
        marginRight: 5,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },

    color1: {
        backgroundColor: 'black',
        width: 15,
        height: 15,
    },
    color2: {
        backgroundColor: 'white',
        width: 15,
        height: 15,
    },

    BoxText: {
        marginLeft: 20,
        color: 'black'
    },

    //FloatBox
    floatBox: {
        marginTop: 50,
        alignItems: 'center',
        marginLeft: 320,
    },

    icAdd: {
        width: 50,
        height: 50,
    },
});

const Item = ({ item, navigation, user, onUpdateDefaultAddress, onDeleteAddressById, listAddress }) => (
    <View style={styleShippingAddress.input}>
        <View style={styleShippingAddress.txt01}>
            <Text style={styleShippingAddress.txt1}>{user.name}</Text>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.navigate("ShippingUpdate", { item: item, listAddress: listAddress })}>
                    <Text style={styleShippingAddress.txt2}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDeleteAddressById(item._id)}>
                    <Text style={styleShippingAddress.txt2}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styleShippingAddress.txt02}>
            <Text>Phone: {item.numberPhone}</Text>
            <Text>{item.body}</Text>
        </View>

        <View style={styleShippingAddress.checkbox}>
            <TouchableOpacity
                onPress={() => onUpdateDefaultAddress(item._id)}
                style={item.status ? styleShippingAddress.BoxChecked : styleShippingAddress.Box}>
                <View style={item.status ? styleShippingAddress.color1 : styleShippingAddress.color2} />
            </TouchableOpacity>
            <Text style={styleShippingAddress.BoxText}>Use as the shipping address</Text>
        </View>
    </View>
);

const data = [
    {
        '_id': '1',
        'body': '3 Newbridge court',
        'status': true,
        'idUser': '64624ff0f1376a12315830b4'
    },
    {
        '_id': '2',
        'body': '3 Newbridge court',
        'status': false,
        'idUser': '64624ff0f1376a12315830b4'
    },
    {
        '_id': '3',
        'body': '3 Newbridge court',
        'status': false,
        'idUser': '64624ff0f1376a12315830b4'
    }
]