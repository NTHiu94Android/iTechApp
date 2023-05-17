import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native'
import React from 'react'

const Shipping = () => {
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
                <Text style={styleShippingAddress.DetailTxt}>Add shipping address</Text>
            </View>

            <ScrollView showsVertic alScrollIndicator={false}>
                <View style={styleShippingAddress.body}>
                    {/* Full Name */}
                    <View style={styleShippingAddress.input}>
                        <Text>Full Name</Text>
                        <TextInput placeholder='Ex:' ></TextInput>
                    </View>

                    {/* Address */}
                    <View style={styleShippingAddress.input}>
                        <Text>Andress</Text>
                        <TextInput placeholder='Ex:' ></TextInput>
                    </View>

                    {/* ZipCode */}
                    <View style={styleShippingAddress.input}>
                        <Text>ZipCode (Postal Code)</Text>
                        <TextInput placeholder='Ex:' ></TextInput>
                    </View>

                    {/* Country */}
                    <View style={styleShippingAddress.viewCountry}>
                        <View>
                            <Text>Country</Text>
                            <TextInput placeholder='Select Country'></TextInput>
                        </View>
                        <View>
                            <Image
                                style={styleShippingAddress.imgDown}
                                source={require('../../../../assets/images/down.png')}
                                resizeMode="cover"></Image>
                        </View>
                    </View>

                    {/* City */}
                    <View style={styleShippingAddress.viewCountry}>
                        <View>
                            <Text>City</Text>
                            <TextInput placeholder='Select City'></TextInput>
                        </View>
                        <View>
                            <Image
                                style={styleShippingAddress.imgDown}
                                source={require('../../../../assets/images/down.png')}
                                resizeMode="cover"></Image>
                        </View>
                    </View>

                    {/* District */}
                    <View style={styleShippingAddress.viewCountry}>
                        <View>
                            <Text>District</Text>
                            <TextInput placeholder='Select District'></TextInput>
                        </View>
                        <View>
                            <Image
                                style={styleShippingAddress.imgDown}
                                source={require('../../../../assets/images/down.png')}
                                resizeMode="cover"></Image>
                        </View>
                    </View>

                    {/* SAVE ADDRESS */}
                    <View style={styleShippingAddress.btn}>
                        <TouchableOpacity>
                            <Text style={styleShippingAddress.btnText}>SAVE ADDRESS</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default Shipping

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
        marginTop: 30
    },

    input: {
        width: '90%',
        height: 65,
        marginLeft: 20,
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#F5F5F5',
        borderRadius: 5,
    },

    btn: {
        backgroundColor: 'black',
        marginTop: 150,
        width: '90%',
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        borderRadius: 8,
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