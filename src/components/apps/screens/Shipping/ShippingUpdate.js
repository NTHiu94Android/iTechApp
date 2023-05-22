import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import back from '../../../back/back';

import { UserContext } from '../../../users/UserContext';
import { AppContext } from '../../AppContext';

import ProgressDialog from 'react-native-progress-dialog';

const ShippingUpdate = (props) => {
    const {navigation} = props;
    const {item} = props.route.params;
    back(navigation);
    const { user } = useContext(UserContext);
    const { 
        onUpdateAddress, countAddress, setCountAddress 
    } = useContext(AppContext);

    const [isLoading, setIsLoading] = useState(false);
    const [address, setAddress] = useState('');

    useEffect(() => {
        setAddress(item.body);
    }, []);

    const handleUpdateAddress = async () => {
        try {
            setIsLoading(true);
            const res = await onUpdateAddress(item._id, address, item.status, user._id);
            if(res.data != undefined) {
                setCountAddress(countAddress + 1);
                console.log('handleUpdateAddress res: ', res.data);
                navigation.goBack();
            }
        } catch (error) {
            setIsLoading(false);
            console.log('handleUpdateAddress error: ', error);
        }
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
                    <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>Update shipping address</Text>
                </View>

                <View style={{ width: 22, height: 22 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styleShippingAddress.body}>
                    {/* Full Name */}
                    <View style={styleShippingAddress.input}>
                        <Text style={{color: 'black', fontWeight: '700'}}>Full Name</Text>
                        <Text style={{marginTop: 5}}>{user.name}</Text>
                    </View>

                    {/* Address */}
                    <View style={styleShippingAddress.input}>
                        <Text style={{color: 'black', fontWeight: '700'}}>Andress</Text>
                        <TextInput
                            multiline={true}
                            value={address}
                            onChangeText={(text) => setAddress(text)}
                            style={{marginBottom: 5, maxWidth: '100%'}}
                        />
                    </View>

                    {/* ZipCode */}
                    <View style={styleShippingAddress.input}>
                        <Text style={{color: 'black', fontWeight: '700'}}>Number phone</Text>
                        <Text style={{marginTop: 5}}>{user.numberPhone}</Text>
                    </View>

                </View>
            </ScrollView>
            {/* SAVE ADDRESS */}
            <View style={styleShippingAddress.btn}>
                <TouchableOpacity onPress={() => handleUpdateAddress()}>
                    <Text style={styleShippingAddress.btnText}>SAVE ADDRESS</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ShippingUpdate

const styleShippingAddress = StyleSheet.create({
    // container
    container: {
        display: 'flex',
        backgroundColor: 'white',
        height: '100%',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20
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
        backgroundColor: 'white',
        height: '100%',
    },

    input: {
        width: '90%',
        marginLeft: 20,
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#F5F5F5',
        borderRadius: 5,
    },

    btn: {
        //position: 'relative',
        backgroundColor: 'black',
        bottom: 20,
        width: '90%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        borderRadius: 30,
    },

    btnText: {
        color: 'white',
        fontSize: 20
    },

    viewCountry: {
        borderColor: '#F5F5F5',
        borderWidth: 1,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        width: '90%',
        height: 65,
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 5,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },

    imgDown: {
        width: 12,
        height: 12,
    },
})