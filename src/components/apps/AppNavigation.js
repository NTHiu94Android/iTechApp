import React, { useState, useEffect } from 'react';
import { BackHandler, ToastAndroid } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from './screens/TabScreen/Home';
import Favorite from './screens/TabScreen/Favorite';
import Cart from './screens/TabScreen/Cart';
import Profile from './screens/TabScreen/Profile';
import ListProduct from './screens/ListProduct/ListProduct';
import ProductDetail from './screens/Product/ProductDetail';
import SearchScreen from './screens/Search/SearchScreen';
import CheckOut from './screens/Cart/CheckOut';
import Success from './screens/Cart/Success';
import AddReview from './screens/Review/AddReview';
import ListReview from './screens/Review/ListReview';
import Setting from './screens/Setting/Setting';
import Shipping from './screens/Shipping/Shipping';
import EditPassword from './screens/Setting/EditPassword';
import UpdateProfile from './screens/Setting/UpdateProfile';
import ShippngAdress from './screens/Shipping/ShippngAdress';
import UpdateAvatar from './screens/Setting/UpdateAvatar';
import Order from './screens/Order/Order';
import OrderDetail from './screens/Order/OrderDetail';
import MyProfile from './screens/TabScreen/MyProfile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()

const BottomNavigation = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused
                            ? 'home'
                            : 'home-outline';
                    } else if (route.name === 'Favorite') {
                        iconName = focused
                            ? 'bookmark'
                            : 'bookmark-outline';
                    } else if (route.name === 'Cart') {
                        iconName = focused
                            ? 'cart'
                            : 'cart-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused
                            ? 'person'
                            : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },

                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'gray',
                initialRouteName: 'Home',
            })}>

            <Tab.Screen options={{ headerShown: false }} name="Home" component={Home} />
            <Tab.Screen options={{ headerShown: false }} name="Favorite" component={Favorite} />
            <Tab.Screen options={{ headerShown: false }} name="Cart" component={Cart} />
            <Tab.Screen options={{ headerShown: false }} name="Profile" component={Profile} />

        </Tab.Navigator>
    )
}


const AppNavigation = () => {
    const [backPressCount, setBackPressCount] = useState(0);
    useEffect(() => {
        const backAction = () => {
            if (backPressCount < 1) {
                setBackPressCount(backPressCount + 1);
                ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
                setTimeout(() => setBackPressCount(0), 1000); // reset after 1 seconds
                return true;
            } else {
                BackHandler.exitApp();
                return true;
            }
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, [backPressCount]);
    
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="BottomNavigation">
                <Stack.Screen options={{ headerShown: false }} name='BottomNavigation' component={BottomNavigation} />
                <Stack.Screen options={{ headerShown: false }} name='ListProduct' component={ListProduct} />
                <Stack.Screen options={{ headerShown: false }} name='ProductDetail' component={ProductDetail} />
                <Stack.Screen options={{ headerShown: false }} name='SearchScreen' component={SearchScreen} />
                <Stack.Screen options={{ headerShown: false }} name='CheckOut' component={CheckOut} />
                <Stack.Screen options={{ headerShown: false }} name='Success' component={Success} />
                <Stack.Screen options={{ headerShown: false }} name='Order' component={Order} />
                <Stack.Screen options={{ headerShown: false }} name='OrderDetail' component={OrderDetail} />
                <Stack.Screen options={{ headerShown: false }} name='Setting' component={Setting} />
                <Stack.Screen options={{ headerShown: false }} name='Shipping' component={Shipping} />
                <Stack.Screen options={{ headerShown: false }} name='ShippngAdress' component={ShippngAdress} />
                <Stack.Screen options={{ headerShown: false }} name='EditPassword' component={EditPassword} />
                <Stack.Screen options={{ headerShown: false }} name='UpdateProfile' component={UpdateProfile} />
                <Stack.Screen options={{ headerShown: false }} name='UpdateAvatar' component={UpdateAvatar} />
                <Stack.Screen options={{ headerShown: false }} name='MyProfile' component={MyProfile} />
                <Stack.Screen options={{ headerShown: false }} name='AddReview' component={AddReview} />
                <Stack.Screen options={{ headerShown: false }} name='ListReview' component={ListReview} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigation;