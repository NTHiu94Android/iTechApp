import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TextInput, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import back from '../../../back/back';

import { UserContext } from '../../../users/UserContext';
import { AppContext } from '../../AppContext';

import ProgressDialog from 'react-native-progress-dialog';

const Shipping = (props) => {
    const { navigation } = props;
    back(navigation);

    const { user, onUpdateProfile } = useContext(UserContext);
    const {
        onAddAddress, onGetAddressByIdUser,
        setCountAddress, countAddress,
    } = useContext(AppContext);

    const [isLoading, setIsLoading] = useState(false);
    const [numberPhone, setNumberPhone] = useState('');
    const [district, setDistrict] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
        if (user.numberPhone != undefined) {
            setNumberPhone(user.numberPhone);
        }
    }, []);

    const handleAddAddress = async () => {
        try {
            setIsLoading(true);
            if (district === '' || city === '' || country === '') {
                Alert.alert('Please enter full address');
                setIsLoading(false);
                return;
            }
            const firstThreeChars = numberPhone.substring(0, 3);
            if (firstThreeChars !== '+84') {
                if (+numberPhone === NaN || numberPhone.length < 10 ||
                    numberPhone.length > 11 || numberPhone.indexOf('0') !== 0 || 
                    numberPhone.indexOf(' ') !== -1) {
                    Alert.alert('Invalid number phone 1');
                    setIsLoading(false);
                    return;
                }
            } else {
                if (+numberPhone === NaN || numberPhone.length < 12 ||
                    numberPhone.length > 13 || numberPhone.indexOf(' ') !== -1) {
                    Alert.alert('Invalid number phone 2');
                    setIsLoading(false);
                    return;
                }
            }

            //Update numberPhone
            //id, email, name, birthday, numberPhone, avatar
            await onUpdateProfile(user._id, user.email, user.name, user.birthday, numberPhone, user.avatar);

            const address = district + ', ' + city + ', ' + country;
            let check = false;
            const resGetAddress = await onGetAddressByIdUser(user._id);
            if (resGetAddress.data != undefined) {
                if (resGetAddress.data.length === 0) {
                    check = true;
                }
            }
            const res = await onAddAddress(address, check, user._id);
            if (res.data != undefined) {
                console.log('handleAddAddress res: ', res.data);
                setCountAddress(countAddress + 1);
                setIsLoading(false);
                navigation.goBack();
            }
        } catch (error) {
            setIsLoading(false);
            console.log('handleAddAddress error: ', error);
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
                    <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>Add shipping address</Text>

                </View>

                <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
                    <View style={{ width: 22, height: 22 }} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styleShippingAddress.body}>
                    {/* Full Name */}
                    <View style={styleShippingAddress.input}>
                        <Text style={{ color: 'black', fontSize: 16, fontWeight: '600' }}>Full Name</Text>
                        <Text style={{ marginVertical: 8 }}>{user.name}</Text>
                    </View>

                    {/* Address */}
                    {/* <View style={styleShippingAddress.input}>
                        <Text>Andress</Text>
                        <TextInput
                            value={address}
                            onChangeText={(text) => setAddress(text)}
                            placeholder='Ex:' ></TextInput>
                    </View> */}

                    {/* Numberphone */}
                    <View style={styleShippingAddress.input}>
                        <Text style={{ color: 'black', fontSize: 16, fontWeight: '600' }}>Number phone</Text>
                        <TextInput
                            value={numberPhone}
                            onChangeText={(text) => setNumberPhone(text)}
                            keyboardType='numeric'
                            placeholder='Ex: 0778023038' >
                        </TextInput>
                    </View>


                    <View style={styleShippingAddress.viewCountry}>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: 'black', fontSize: 16, fontWeight: '600' }}>District</Text>
                            <TextInput
                                value={district}
                                onChangeText={(text) => setDistrict(text)}
                                placeholder='Select district'
                            />
                        </View>
                    </View>

                    <View style={styleShippingAddress.viewCountry}>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: 'black', fontSize: 16, fontWeight: '600' }}>City</Text>
                            <TextInput
                                value={city}
                                onChangeText={(text) => setCity(text)}
                                placeholder='Select city'
                            />
                        </View>

                    </View>

                    <View style={styleShippingAddress.viewCountry}>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: 'black', fontSize: 16, fontWeight: '600' }}>Country</Text>
                            <TextInput
                                value={country}
                                onChangeText={(text) => setCountry(text)}
                                placeholder='Select Country'
                            />
                        </View>

                    </View>


                </View>
            </ScrollView>
            {/* SAVE ADDRESS */}
            <View style={styleShippingAddress.btn}>
                <TouchableOpacity onPress={() => handleAddAddress()}>
                    <Text style={styleShippingAddress.btnText}>SAVE ADDRESS</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Shipping

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
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#F5F5F5',
        borderRadius: 5,
    },

    btn: {
        //position: 'relative',
        backgroundColor: 'black',
        bottom: 20,
        marginTop: 30,
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
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 5,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },

    imgDown: {
        width: 12,
        height: 12,
    },
})