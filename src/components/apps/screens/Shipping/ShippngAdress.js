import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import back from '../../../back/back';

const ShippngAdress = (props) => {
    const { navigation } = props;
    back(navigation);
    return (
        <View style={styleShippingAddress.container}>
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
                    <View style={{width: 22, height: 22}}/>
                </TouchableOpacity>
            </View>

            <View style={styleShippingAddress.body}>
                <View style={styleShippingAddress.input}>
                    <View style={styleShippingAddress.txt01}>
                        <Text style={styleShippingAddress.txt1}>Jane Doe</Text>
                        <Text style={styleShippingAddress.txt2}>Edit</Text>
                    </View>

                    <View style={styleShippingAddress.txt02}>
                        <Text>3 Newbridge court</Text>
                        <Text>Chino Hills, CA 91709, United States</Text>
                    </View>

                    <View style={styleShippingAddress.checkbox}>
                        <TouchableOpacity style={styleShippingAddress.Box}>
                            <Text> </Text>
                        </TouchableOpacity>
                        <Text style={styleShippingAddress.BoxText}>Use as the shipping address</Text>
                    </View>
                </View>

                <View style={styleShippingAddress.input}>
                    <View style={styleShippingAddress.txt01}>
                        <Text style={styleShippingAddress.txt1}>Jane Doe</Text>
                        <Text style={styleShippingAddress.txt2}>Edit</Text>
                    </View>

                    <View style={styleShippingAddress.txt02}>
                        <Text>3 Newbridge court</Text>
                        <Text>Chino Hills, CA 91709, United States</Text>
                    </View>

                    <View style={styleShippingAddress.checkbox}>
                        <TouchableOpacity style={styleShippingAddress.Box}>
                            <Text> </Text>
                        </TouchableOpacity>
                        <Text style={styleShippingAddress.BoxText}>Use as the shipping address</Text>
                    </View>
                </View>

                <View style={styleShippingAddress.input}>
                    <View style={styleShippingAddress.txt01}>
                        <Text style={styleShippingAddress.txt1}>Jane Doe</Text>
                        <Text style={styleShippingAddress.txt2}>Edit</Text>
                    </View>

                    <View style={styleShippingAddress.txt02}>
                        <Text>3 Newbridge court</Text>
                        <Text>Chino Hills, CA 91709, United States</Text>
                    </View>

                    <View style={styleShippingAddress.checkbox}>
                        <TouchableOpacity style={styleShippingAddress.Box}>
                            <Text> </Text>
                        </TouchableOpacity>
                        <Text style={styleShippingAddress.BoxText}>Use as the shipping address</Text>
                    </View>
                </View>

                <View style={styleShippingAddress.floatBox} >
                    <TouchableOpacity onPress={() => navigation.navigate("Shipping")}>
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
        color: 'red'
    },

    //CheckBOx
    checkbox: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },

    Box: {
        width: 25,
        header: 25,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 5,
        marginRight: 5
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
})