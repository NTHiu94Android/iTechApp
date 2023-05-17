import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const ShippngAdress = () => {
    return (
        <View style={styleShippingAddress.container}>
            <View style={styleShippingAddress.header}>
                <View>
                    <TouchableOpacity>
                        <Image
                            style={styleShippingAddress.icBack}
                            source={require('../../../../assets/images/back.png')}
                            resizeMode='cover'
                        ></Image>
                    </TouchableOpacity>
                </View>
                <Text style={styleShippingAddress.DetailTxt}>Shipping Address</Text>
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
                    <TouchableOpacity>
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
        marginTop: 30,
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

    txt02:{
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
    floatBox:{
        marginTop: 50,
        alignItems: 'center',
        marginLeft: 320,
    },

    icAdd: {
        width: 50,
        height: 50,
    },
})