import { useEffect } from 'react';
import { BackHandler, ToastAndroid } from 'react-native';

const backToScreen = (navigation, screen) => {
    useEffect(() => {
        const backAction = () => {
            //Bat su kien khi click tro ve tren he thong android
            //ToastAndroid.show('Go back', ToastAndroid.SHORT);
            navigation.navigate(screen);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, []);
}

export default backToScreen