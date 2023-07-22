import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TextInput, Alert, Dimensions, ToastAndroid } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import back from '../../../back/back';
import AddressData from './Address'

import { UserContext } from '../../../users/UserContext';
import { AppContext } from '../../AppContext';

import ProgressDialog from 'react-native-progress-dialog';
import SelectDropdown from 'react-native-select-dropdown';
import VerifiPhone from '../VerifiPhone/VerifiPhone';
import auth from '@react-native-firebase/auth';

const width = Dimensions.get('window').width;

const Shipping = (props) => {
    const { navigation } = props;
    back(navigation);
    const { listAddress } = props.route.params;
    const { user, onUpdateProfile } = useContext(UserContext);
    const {
        onAddAddress, onGetAddressByIdUser,
        setCountAddress, countAddress,
    } = useContext(AppContext);


    const [isLoading, setIsLoading] = useState(false);
    const [numberPhone, setNumberPhone] = useState('0947749610');
    const [district, setDistrict] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');

    const [listCountry, setListCountry] = useState([]);
    const [listCity, setListCity] = useState([]);
    const [listDistrict, setListDistrict] = useState([]);

    const [isShowDialog, setIsShowDialog] = useState(false);
    const [confirm, setConfirm] = useState(null);

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    // Handle login
    function onAuthStateChanged(user) {
        if (user) {
            // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
            // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
            // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
            // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
        }
    }

    useEffect(() => {
        if (user.numberPhone != undefined) {
            setNumberPhone(user.numberPhone);
        }
    }, []);

    const signInWithPhoneNumber = async (numberPhone) => {
        //Neu so dau tien la so 0 thi doi thanh +84
        if (numberPhone.charAt(0) === '0') {
            numberPhone = '+84' + numberPhone.substring(1, numberPhone.length);
        }
        console.log('signInWithPhoneNumber: ', numberPhone);
        setTimeout(() => {
            setIsLoading(false);
            //ToastAndroid.show('Please try again!', ToastAndroid.SHORT);
            return;

        }, 10000);
        const confirmation = await auth().signInWithPhoneNumber(numberPhone);
        //console.log('confirmation: ', confirmation);
        setConfirm(confirmation);

        setIsLoading(false);
        setIsShowDialog(true);
    };

    //Lay danh sach tinh thanh
    useEffect(() => {
        const getCountry = () => {
            const listCountry = AddressData.map((item) => {
                return item.name;
            });
            setListCountry(listCountry);
        };
        getCountry();
    }, []);

    //Lay danh sach quan huyen, thanh pho
    useEffect(() => {
        const getCity = () => {
            let listCity = [];
            for (let i = 0; i < AddressData.length; i++) {
                if (AddressData[i].name === country) {
                    for (let j = 0; j < AddressData[i].districts.length; j++) {
                        listCity.push(AddressData[i].districts[j].name);
                    }
                }
            }
            setCity(listCity[0])
            setListCity(listCity);
        };
        getCity();
    }, [listCountry, country]);

    //Lay danh sach phuong xa, quan huyen
    useEffect(() => {
        const getDistrist = () => {
            let listDistrict = [];

            for (let i = 0; i < AddressData.length; i++) {
                if (AddressData[i].name === country) {
                    for (let j = 0; j < AddressData[i].districts.length; j++) {
                        if (AddressData[i].districts[j].name === city) {
                            for (let k = 0; k < AddressData[i].districts[j].wards.length; k++) {
                                listDistrict.push(AddressData[i].districts[j].wards[k].name);
                            }
                        }
                    }
                }
            }
            setDistrict(listDistrict[0]);
            setListDistrict(listDistrict);
        };
        getDistrist();
    }, [listCity, city]);


    const handleAddAddress = async () => {
        try {
            setIsLoading(true);
            //Check input
            if (district === '' || city === '' || country === '') {
                Alert.alert('Please enter full address');
                setIsLoading(false);
                return;
            }
            const firstThreeChars = numberPhone.substring(0, 3);
            const firstOneChars = numberPhone.substring(0, 1);
            if (firstThreeChars !== '+84') {
                if (+numberPhone === NaN || numberPhone.length != 10 || numberPhone.indexOf('0') !== 0 ||
                    numberPhone.indexOf(' ') !== -1) {
                    Alert.alert('Invalid number phone 1');
                    setIsLoading(false);
                    return;
                }
            } else if(firstOneChars != '0') {
                if (+numberPhone === NaN || numberPhone.length != 12 || numberPhone.indexOf(' ') !== -1) {
                    Alert.alert('Invalid number phone 2');
                    setIsLoading(false);
                    return;
                }
            }
            else {
                if (+numberPhone === NaN || numberPhone.length < 12 ||
                    numberPhone.length > 13 || numberPhone.indexOf(' ') !== -1) {
                    Alert.alert('Invalid number phone 2');
                    setIsLoading(false);
                    return;
                }
            }

            //Check number phone
            let check = false;
            if (listAddress.length > 0) {
                for (let i = 0; i < listAddress.length; i++) {
                    if (listAddress[i].numberPhone === numberPhone) {
                        check = true;
                        break;
                    }
                }
            }

            console.log('check: ', check);

            //Neu so dien thoai chua duoc xac thuc thi xac thuc
            if (check == false) {
                //Show dialog xác thuc mã OTP
                signInWithPhoneNumber(numberPhone);
            } else {
                //Add address va update so dien thoai
                await updateNumberPhone(numberPhone);
                await addAddress();
            }

        } catch (error) {
            setIsLoading(false);
            console.log('handleAddAddress error: ', error);
        }
    };

    const addAddress = async () => {
        const address = district + ', ' + city + ', ' + country;
        //console.log('address: ', address);
        let check = false;
        const resGetAddress = await onGetAddressByIdUser(user._id);
        if (resGetAddress.data != undefined) {
            if (resGetAddress.data.length === 0) {
                check = true;
            }
        }
        const res = await onAddAddress(address, check, numberPhone, user._id);
        if (res.data != undefined) {
            console.log('handleAddAddress res: ', res.data);
            setCountAddress(countAddress + 1);
            navigation.goBack();
        }
        setIsLoading(false);
    }

    const updateNumberPhone = async (numberPhone) => {
        if (user.numberPhone) {
            return;
        }
        await onUpdateProfile(user._id, user.email, user.name, user.birthday, numberPhone, user.avatar);
    }

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

                <TouchableOpacity>
                    <View style={{ width: 22, height: 22 }} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styleShippingAddress.body}>
                    {/* Full Name */}
                    <View style={styleShippingAddress.input}>
                        <Text style={{ color: 'black', fontSize: 18, fontWeight: '600' }}>Full Name</Text>
                        <Text style={{ marginVertical: 8, paddingHorizontal: 20 }}>{user.name}</Text>
                    </View>

                    {/* Numberphone */}
                    <View style={styleShippingAddress.input}>
                        <Text style={{ color: 'black', fontSize: 18, fontWeight: '600', marginBottom: 4 }}>Number phone</Text>
                        <TextInput
                            value={numberPhone}
                            onChangeText={(text) => setNumberPhone(text)}
                            keyboardType='numeric'
                            style={[styleShippingAddress.dropdown1BtnStyle, { paddingHorizontal: 20 }]}
                            placeholder='Ex: 0778023038' >
                        </TextInput>
                    </View>


                    <View style={styleShippingAddress.viewCountry}>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: 'black', fontSize: 18, fontWeight: '600', marginBottom: 4 }}>Province</Text>
                            {/* <TextInput
                                value={country}
                                options={listCountry}
                                onChangeText={(text) => {
                                    setCountry(text)
                                }}
                                placeholder='Select country'

                            /> */}
                            <SelectDropdown
                                data={listCountry}
                                // defaultValueByIndex={1}
                                // defaultValue={'Egypt'}
                                onSelect={(selectedItem, index) => {
                                    console.log(selectedItem, index);
                                    setCountry(selectedItem);
                                }}
                                defaultButtonText={'Select country'}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem;
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item;
                                }}
                                buttonStyle={styleShippingAddress.dropdown1BtnStyle}
                                buttonTextStyle={styleShippingAddress.dropdown1BtnTxtStyle}
                                renderDropdownIcon={isOpened => {
                                    return (
                                        isOpened ?
                                            <Image
                                                style={{ width: 18, height: 18, tintColor: '#000' }}
                                                source={require('../../../../assets/images/up.png')}
                                            /> :
                                            <Image
                                                style={{ width: 18, height: 18, tintColor: '#000' }}
                                                source={require('../../../../assets/images/down1.png')}
                                            />
                                    )
                                }}
                                dropdownIconPosition={'right'}
                                dropdownStyle={styleShippingAddress.dropdown1DropdownStyle}
                                rowStyle={styleShippingAddress.dropdown1RowStyle}
                                rowTextStyle={styleShippingAddress.dropdown1RowTxtStyle}
                            />
                        </View>
                    </View>

                    {/* <View style={styleShippingAddress.viewCountry}>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: 'black', fontSize: 16, fontWeight: '600' }}>City</Text>
                            <TextInput
                                value={city}
                                onChangeText={(text) => setCity(text)}
                                placeholder='Select city'
                            />
                        </View>

                    </View> */}
                    <View style={styleShippingAddress.viewCountry}>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: 'black', fontSize: 18, fontWeight: '600', marginBottom: 4 }}>City</Text>
                            {/* <TextInput
                                value={country}
                                options={listCountry}
                                onChangeText={(text) => {
                                    setCountry(text)
                                }}
                                placeholder='Select country'

                            /> */}
                            <SelectDropdown
                                data={listCity}
                                // defaultValueByIndex={1}
                                // defaultValue={'Egypt'}
                                onSelect={(selectedItem, index) => {
                                    console.log(selectedItem, index);
                                    setCity(selectedItem);
                                }}
                                defaultButtonText={'Select city'}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem;
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item;
                                }}
                                buttonStyle={styleShippingAddress.dropdown1BtnStyle}
                                buttonTextStyle={styleShippingAddress.dropdown1BtnTxtStyle}
                                renderDropdownIcon={isOpened => {
                                    return (
                                        isOpened ?
                                            <Image
                                                style={{ width: 18, height: 18, tintColor: '#000' }}
                                                source={require('../../../../assets/images/up.png')}
                                            /> :
                                            <Image
                                                style={{ width: 18, height: 18, tintColor: '#000' }}
                                                source={require('../../../../assets/images/down1.png')}
                                            />
                                    )
                                }}
                                dropdownIconPosition={'right'}
                                dropdownStyle={styleShippingAddress.dropdown1DropdownStyle}
                                rowStyle={styleShippingAddress.dropdown1RowStyle}
                                rowTextStyle={styleShippingAddress.dropdown1RowTxtStyle}
                            />
                        </View>
                    </View>

                    {/* <View style={styleShippingAddress.viewCountry}>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: 'black', fontSize: 16, fontWeight: '600' }}>Country</Text>
                            <TextInput
                                value={district}
                                onChangeText={(text) => setCountry(text)}
                                placeholder='Select district'
                            />
                        </View>

                    </View> */}

                    <View style={styleShippingAddress.viewCountry}>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: 'black', fontSize: 18, fontWeight: '600', marginBottom: 4 }}>District</Text>
                            {/* <TextInput
                                value={country}
                                options={listCountry}
                                onChangeText={(text) => {
                                    setCountry(text)
                                }}
                                placeholder='Select country'

                            /> */}
                            <SelectDropdown
                                data={listDistrict}
                                // defaultValueByIndex={1}
                                // defaultValue={'Egypt'}
                                onSelect={(selectedItem, index) => {
                                    console.log(selectedItem, index);
                                    setDistrict(selectedItem);
                                }}
                                defaultButtonText={'Select district'}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem;
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item;
                                }}
                                buttonStyle={styleShippingAddress.dropdown1BtnStyle}
                                buttonTextStyle={styleShippingAddress.dropdown1BtnTxtStyle}
                                renderDropdownIcon={isOpened => {
                                    return (
                                        isOpened ?
                                            <Image
                                                style={{ width: 18, height: 18, tintColor: '#000' }}
                                                source={require('../../../../assets/images/up.png')}
                                            /> :
                                            <Image
                                                style={{ width: 18, height: 18, tintColor: '#000' }}
                                                source={require('../../../../assets/images/down1.png')}
                                            />
                                    )
                                }}
                                dropdownIconPosition={'right'}
                                dropdownStyle={styleShippingAddress.dropdown1DropdownStyle}
                                rowStyle={styleShippingAddress.dropdown1RowStyle}
                                rowTextStyle={styleShippingAddress.dropdown1RowTxtStyle}
                            />
                        </View>
                    </View>


                </View>

            </ScrollView>
            {
                isShowDialog ?
                    <VerifiPhone
                        confirm={confirm}
                        numberPhone={numberPhone}
                        updateNumberPhone={updateNumberPhone}
                        setIsShowDialog={setIsShowDialog}
                        isVisible={isShowDialog}
                        addAddress={addAddress} /> : null
            }
            {/* SAVE ADDRESS */}
            <View style={styleShippingAddress.btn}>
                <TouchableOpacity onPress={() => handleAddAddress()}>
                    <Text style={styleShippingAddress.btnText}>Save address</Text>
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
        paddingHorizontal: 20,
        marginTop: 10,
        // borderRadius: 5,
        // borderColor: '#F5F5F5',
        // borderWidth: 1,
        backgroundColor: 'white',
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
        alignSelf: 'center',
    },

    btnText: {
        color: 'white',
        fontSize: 20
    },

    viewCountry: {
        // borderColor: '#F5F5F5',
        // borderWidth: 1,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 5,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    viewCountry2: {
        backgroundColor: 'white',
        width: '90%',
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
    dropdown1BtnStyle: {
        width: width - 40,
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    dropdown1BtnTxtStyle: { color: '#444', textAlign: 'left', fontSize: 14 },
    dropdown1DropdownStyle: { backgroundColor: '#EFEFEF' },
    dropdown1RowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
    dropdown1RowTxtStyle: { color: '#444', textAlign: 'left' },
})