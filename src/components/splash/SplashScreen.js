import { StyleSheet, View, Image } from 'react-native'
import React, { useEffect } from 'react'

const SplashScreen = (props) => {
    const { navigation } = props;
    const nextScreen = () => {
        navigation.navigate('SplashNavigation');
    }
    
    useEffect(() => {
        setTimeout(nextScreen, 2000);
    }, []);
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image style={styles.img} source={require('../../assets/images/logo.png')}></Image>
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    img: {
        width: 150,
        height: 170,
        // marginTop: 100,
        // marginBottom: 30
    },

    text: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold'
    },

    btn: {
        width: 100,
        height: 50,
        marginTop: 50,
        backgroundColor: 'black',
    }
})