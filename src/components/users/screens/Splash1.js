import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash1 = ({ navigation }) => {
    useEffect(() => {
        const checkFirstBuild = async () => {
            const first = await AsyncStorage.getItem('firstBuild');
            if (first != null) {
                navigation.navigate('Login');
            }
        };
        checkFirstBuild();
    }, []);
    return (
        <View style={{
            backgroundColor: 'white', flex: 1,
            alignItems: 'center',
            position: 'relative'
        }}>
            <Image
                style={{ width: 250, height: 250, marginHorizontal: 10, marginTop: 100 }}
                source={require('../../../assets/images/ic_splash3.png')}
            />
            <View style={{ alignItems: 'center', paddingHorizontal: 50 }}>
                <Text style={{ fontWeight: 'bold', color: 'grey', fontSize: 25, marginTop: 50 }} >Keep !</Text>
                <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 10, fontWeight: 'bold' }} >
                    This brochure gives you a detail introduction of our company and products
                </Text>
            </View>



            <View style={{
                bottom: 30, position: 'absolute',
                alignItems: 'center', justifyContent: 'center',
            }}>
                <TouchableOpacity onPress={() => navigation.navigate('Splash2')}>
                    <View style={{
                        backgroundColor: 'black',
                        width: 250,
                        height: 50,
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 10,
                        padding: 10,
                    }}>
                        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 20, }} >Next</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                    <View style={{
                        width: 21, height: 21, borderRadius: 11,
                        backgroundColor: 'white',
                        borderColor: 'black', borderWidth: 1,
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: 'black' }}></View>
                    </View>

                    <View style={{
                        width: 21, height: 21, borderRadius: 11,
                        backgroundColor: 'white',
                        borderColor: 'black', borderWidth: 1,
                        justifyContent: 'center', alignItems: 'center',
                        marginHorizontal: 10
                    }}>
                        <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: 'white' }}></View>
                    </View>

                    <View style={{
                        width: 21, height: 21, borderRadius: 11,
                        backgroundColor: 'white',
                        borderColor: 'black', borderWidth: 1,
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: 'white' }}></View>
                    </View>
                </View>


            </View>

        </View>
    )
}

export default Splash1

const styles = StyleSheet.create({})