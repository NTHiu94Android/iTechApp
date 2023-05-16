import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../users/UserContext';
import { AppContext } from '../../AppContext';

import Swiper from 'react-native-swiper';
import ProgressDialog from 'react-native-progress-dialog';

const Home = (props) => {
    const { navigation } = props;
    const { } = useContext(UserContext);
    const { onGetCategories, onGetProducts, onGetSubProducts, onGetReviews } = useContext(AppContext);

    const [listCategory, setListCategory] = useState([]);

    const [ListSale, setListSale] = useState([]);
    const [listPhone, setListPhone] = useState([]);
    const [listLaptop, setListLaptop] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    //Lay danh sach category
    useEffect(() => {
        const getData = async () => {
            try {
                setIsLoading(true);
                const resCategory = await onGetCategories();
                setListCategory(resCategory.data);
                //Lay danh sach san pham
                const resProduct = await onGetProducts();
                if (resProduct == null || resProduct == undefined) {
                    setIsLoading(false);
                    return;
                }
                const listProduct = resProduct.data;

                //Them sao va subProduct vao tung item
                for (let i = 0; i < listProduct.length; i++) {
                    listProduct[i].rating = await getStar(listProduct[i]._id);
                    const subProduct = await onGetSubProductsByIdProduct(listProduct[i]._id);
                    listProduct[i].subProduct = subProduct;
                }

                //Lay danh sach san pham sale va add vao listSale
                let listSale = [];
                for (let i = 0; i < listProduct.length; i++) {
                    if (listProduct[i].subProduct[0].sale > 5) {
                        listSale.push(listProduct[i]);
                    }
                }
                setListSale(listSale);

                //Lay danh sach san pham phone va add vao listPhone

                //Lay danh sach san pham laptop va add vao listLaptop

                setIsLoading(false);
            } catch (error) {
                console.log("Error home screen: ", error);
            }
        };
        getData();
    }, []);

    //Lay danh sach subProduct theo idProduct
    const onGetSubProductsByIdProduct = async (idProduct) => {
        try {
            const res = await onGetSubProducts();
            if(res == null || res == undefined){
                return;
            }else{
                const subProduct = res.data.filter((item) => item.idProduct == idProduct);
                return subProduct;
            }
        } catch (error) {
            console.log('onGetSubProductsByIdProduct error: ', error);
        }
    };

    //Lay sao tu danh gia set vao tung item
    const getStar = async (idProduct) => {
        let star = 0;
        let count = 0;
        const res = await onGetReviews();
        if (res == null || res == undefined) {
            return 0;
        }
        const review = res.data;
        for (let i = 0; i < review.length; i++) {
            if (review[i].idProduct == idProduct) {
                count = count + 1;
                star += review[i].rating;
            }
        }
        if (count == 0) {
            return 0;
        } else {
            return (star / count).toFixed(1);
        }
    };

    const nextScreen = (category) => {
        navigation.navigate('ListProduct', { category });
    };

    const goToProductDetail = (productItem) => {
        navigation.navigate('ProductDetail', { productItem });
    };

    return (
        <View style={styles.container}>
            <ProgressDialog
                visible={isLoading}
                loaderColor="black"
                lable="Please wait..." />

            {/* Top bar */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12 }}>
                <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
                    <Image
                        style={{ width: 22, height: 22 }}
                        resizeMode='cover'
                        source={require('../../../../assets/images/menu.png')} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 150, height: 50 }}>
                    <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>Hoang</Text>
                    <Image
                        style={{ width: 30, height: 35 }}
                        resizeMode='cover'
                        source={require('../../../../assets/images/ic_profile2.png')} />
                    <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>Long</Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
                    <Image
                        style={{ width: 22, height: 22 }}
                        resizeMode='cover'
                        source={require('../../../../assets/images/ic_search.png')} />
                </TouchableOpacity>
            </View>

            {/* Body */}
            <ScrollView showsVerticalScrollIndicator={false}> 

                {/* Slide banner */}
                <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                    <Swiper
                        style={{ height: 150 }}
                        autoplayTimeout={5}
                        autoplay={true}
                        loop={true}
                        showsPagination={true}
                    >
                        <Image
                            style={{ width: '100%', height: 150 }}
                            resizeMode='stretch'
                            source={{ uri: 'https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/2023/04/banner/720-220-720x220-67.png' }} />
                        <Image
                            style={{ width: '100%', height: 150 }}
                            resizeMode='stretch'
                            source={{ uri: 'https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/2023/04/banner/DH-XA-HANG-720-220-720x220.png' }} />
                        <Image
                            style={{ width: '100%', height: 150 }}
                            resizeMode='stretch'
                            source={{ uri: 'https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/2023/04/banner/iP-14-720-220-720x220-1.png' }} />
                        <Image
                            style={{ width: '100%', height: 150 }}
                            resizeMode='stretch'
                            source={{ uri: 'https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/2023/04/banner/realme-C55-720-220-720x220-2.png' }} />

                    </Swiper>
                </View>

                {/* Category */}
                <ScrollView style={{ marginTop: 12, marginHorizontal: 3, height: 90 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                    {
                        listCategory.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    style={{ marginHorizontal: 3, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', padding: 5, width: 100, height: 80 }}
                                    key={index}
                                    onPress={() => nextScreen(item)}>
                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Image
                                            style={{ width: 40, height: 40, marginBottom: 5 }}
                                            resizeMode='cover'
                                            source={{ uri: item.image }} />
                                        <Text>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>



                {/* Banner 1 */}
                <Image
                    style={{ width: '100%', height: 70 }}
                    resizeMode='cover'
                    source={{ uri: 'https://images.fpt.shop/unsafe/fit-in/1200x200/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/5/10/638193122057042546_F-H5_1200x200.png' }} />

                {/* Hot Sale */}
                <View style={{ padding: 4, paddingBottom: 10 }}>
                    {/* Hot Sale */}
                    <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
                        <Image
                            style={{ width: 32, height: 32, marginRight: 10 }}
                            resizeMode='cover'
                            source={require('../../../../assets/images/ic_fire.png')}
                        />
                        <Text style={{ fontSize: 20, fontWeight: '800', color: 'red' }}>Hot sale</Text>
                    </View>

                    {/* List item */}
                    <FlatList
                        data={ListSale}
                        renderItem={({ item }) => <Item onPress={() => goToProductDetail(item)} item={item} />}
                        keyExtractor={item => item._id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                    <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '800', textDecorationLine: 'underline' }}>See more &gt;</Text>
                </View>

                {/* Banner 2 */}
                <Image
                    style={{ width: '100%', height: 70 }}
                    resizeMode='cover'
                    source={{ uri: 'https://images.fpt.shop/unsafe/fit-in/1200x200/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/5/1/638184972894739287_F-H5_1200x200.png' }} />

                {/* Featered phone */}
                <View style={{ padding: 4, paddingBottom: 10 }}>
                    {/* Text */}
                    <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
                        <Image
                            style={{ width: 32, height: 32, marginRight: 10 }}
                            resizeMode='cover'
                            source={require('../../../../assets/images/ic_fire.png')}
                        />
                        <Text style={{ fontSize: 20, fontWeight: '800', color: 'red' }}>Featured phone</Text>
                    </View>

                    {/* List item */}
                    <FlatList
                        data={ListSale}
                        renderItem={({ item }) => <Item item={item} />}
                        keyExtractor={item => item._id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                    <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '800', textDecorationLine: 'underline' }}>See more &gt;</Text>
                </View>

                {/* Banner 3 */}
                <Image
                    style={{ width: '100%', height: 70 }}
                    resizeMode='cover'
                    source={{ uri: 'https://images.fpt.shop/unsafe/fit-in/1200x200/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/5/10/638193122057042546_F-H5_1200x200.png' }} />

                {/* Featured laptop */}
                <View style={{ padding: 4, paddingBottom: 10 }}>
                    {/* Hot Sale */}
                    <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
                        <Image
                            style={{ width: 32, height: 32, marginRight: 10 }}
                            resizeMode='cover'
                            source={require('../../../../assets/images/ic_fire.png')}
                        />
                        <Text style={{ fontSize: 20, fontWeight: '800', color: 'red' }}>Featured laptop</Text>
                    </View>

                    {/* List item */}
                    <FlatList
                        data={ListSale}
                        renderItem={({ item }) => <Item onPress={()=> goToProductDetail(item)} item={item} />}
                        keyExtractor={item => item._id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                    <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '800', textDecorationLine: 'underline' }}>See more &gt;</Text>
                </View>


            </ScrollView>

        </View>


    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        backgroundColor: 'white'
    },
    itemContainer: {
        flex: 1,
        width: '100%',
        elevation: 5,
        shadowColor: 'grey',
        borderRadius: 8,
        paddingBottom: 12,
        shadowOffset: {
            width: 1,
            height: 3
        },
        backgroundColor: '#F5F5F5',
        shadowRadius: 5,
        shadowOpacity: 0.3
    },
    viewSaleDam: {
        flexDirection: 'row',
        paddingVertical: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        width: '100%',
        borderTopEndRadius: 8,
        borderTopStartRadius: 8
    }
});

const Item = ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress} style={{ marginHorizontal: 3 }}>
        <View style={styles.itemContainer}>
            <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
                <View style={styles.viewSaleDam}>
                    <Text style={{ fontSize: 16, color: 'white', fontWeight: '600', marginRight: 8 }}>Sale</Text>
                    <Text style={{ fontSize: 14, color: 'yellow', fontWeight: '400', fontFamily: 'Caveat' }}>Sieu dam</Text>
                </View>
                <Image
                    style={{ width: '100%', height: 160, position: 'relative' }}
                    resizeMode='cover'
                    source={{ uri: item.image }} />
                <Image
                    style={{ width: 35, height: 35, position: 'absolute', right: 13, bottom: 60 }}
                    resizeMode='cover'
                    source={require('../../../../assets/images/ic_shop.png')} />
                <Text style={{ height: 19, color: 'black', fontWeight: '800', fontSize: 14, marginTop: 5, marginHorizontal: 5, maxWidth: 130 }}>
                    {item.name}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        style={{ width: 15, height: 15, marginEnd: 5 }}
                        resizeMode='cover'
                        source={require('../../../../assets/images/ic_star.png')}
                    />
                    <Text style={{ fontWeight: '700' }}>{item.rating}</Text>
                </View>

                {
                    item.subProduct[0].sale > 0 ?
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ height: 19, color: 'black', fontWeight: '700', fontSize: 14, lineHeight: 19.1, marginEnd: 5 }}>
                                Price:
                            </Text>
                            <Text style={{ height: 19, color: 'black', textDecorationLine: 'line-through', fontWeight: '500', fontSize: 14, lineHeight: 19.1, }}>
                                {item.subProduct[0].price} $
                            </Text>
                            <Text style={{ height: 19, color: 'red', fontWeight: '700', fontSize: 14, lineHeight: 19.1, marginStart: 10 }}>
                                {item.subProduct[0].price - item.subProduct[0].price * item.subProduct[0].sale / 100} $
                            </Text>
                        </View> :
                        <Text style={{ height: 19, color: 'black', fontWeight: '700', fontSize: 14, lineHeight: 19.1 }}>
                            Price: {item.subProduct[0].price} $
                        </Text>
                }
                <View style={{ flexDirection: 'row', paddingHorizontal: 8 }}>
                    <Image
                        style={{ width: 15, height: 15, marginEnd: 5 }}
                        resizeMode='cover'
                        source={require('../../../../assets/images/ic_cpu.png')}
                    />
                    <Text style={{ fontWeight: '700' }}>CPU {item.subProduct[0].cpu}</Text>
                </View>

                <View style={{ flexDirection: 'row', paddingHorizontal: 8 }}>
                    <Image
                        style={{ width: 15, height: 15, marginEnd: 5 }}
                        resizeMode='cover'
                        source={require('../../../../assets/images/ic_ram.png')}
                    />
                    <Text style={{ fontWeight: '700' }}>Ram {item.subProduct[0].ram}</Text>
                </View>

                <View style={{ flexDirection: 'row', paddingHorizontal: 8 }}>
                    <Image
                        style={{ width: 15, height: 15, marginEnd: 5 }}
                        resizeMode='cover'
                        source={require('../../../../assets/images/ic_rom.png')}
                    />
                    <Text style={{ fontWeight: '700' }}>Rom {item.subProduct[0].rom}</Text>
                </View>

                <View style={{ flexDirection: 'row', paddingHorizontal: 8, width: '80%' }}>
                    <Image
                        style={{ width: 15, height: 15, marginEnd: 5 }}
                        resizeMode='cover'
                        source={require('../../../../assets/images/ic_screen.png')}
                    />
                    <Text numberOfLines={1} style={{ fontWeight: '700', }}>Screen {item.subProduct[0].screen}</Text>
                </View>


            </View>
        </View>
    </TouchableOpacity>
);

const data = [
    {
        _id: '1',
        image: 'https://www.mobiledokan.com/wp-content/uploads/2022/09/Apple-iPhone-14-Pro-Max.jpg',
        name: 'Iphone 12 Pro Max',
        idCategory: '1',
        idBrand: '1'
    },
    {
        _id: '2',
        image: 'https://www.tradeinn.com/f/13828/138281763/samsung-galaxy-s20fe-2021-6gb-128gb-6.5-dual-sim-smartphone.jpg',
        name: 'Iphone 12 Pro Max',
        idCategory: '1',
        idBrand: '1'
    },
    {
        _id: '3',
        image: 'https://www.mobiledokan.com/wp-content/uploads/2022/09/Apple-iPhone-14-Pro-Max.jpg',
        name: 'Iphone 12 Pro Max',
        idCategory: '1',
        idBrand: '1'
    },
    {
        _id: '4',
        image: 'https://www.mobiledokan.com/wp-content/uploads/2022/09/Apple-iPhone-14-Pro-Max.jpg',
        name: 'Iphone 12 Pro Max',
        idCategory: '1',
        idBrand: '1'
    },
];

const subProduct = [
    {
        _id: '1.1',
        price: 25,
        sale: 5,
        description: 'Iphone 12 Pro Max 256GB',
        color: 'blue',
        quantity: 1000,
        ram: 8,
        rom: 256,
        screen: "6.5",
        pin: 5000,
        cpu: 'Snapdragon 888',
        back_camera: '12MP',
        front_camera: '12MP',
        idProduct: '1'
    },
    {
        _id: '1.2',
        price: 25,
        sale: 5,
        description: 'Iphone 12 Pro Max 256GB',
        color: 'red',
        quantity: 1000,
        ram: 8,
        rom: 256,
        screen: "6.5",
        pin: 5000,
        cpu: 'Snapdragon 888',
        back_camera: '12MP',
        front_camera: '12MP',
        idProduct: '1'
    },
    {
        _id: '2.1',
        price: 25,
        sale: 5,
        description: 'Iphone 12 Pro Max 256GB',
        color: 'blue',
        quantity: 1000,
        ram: 8,
        rom: 256,
        screen: "6.5",
        pin: 5000,
        cpu: 'Snapdragon 888',
        back_camera: '12MP',
        front_camera: '12MP',
        idProduct: '2'
    },
    {
        _id: '2.2',
        price: 25,
        sale: 5,
        description: 'Iphone 12 Pro Max 256GB',
        color: 'red',
        quantity: 1000,
        ram: 8,
        rom: 256,
        screen: "6.5",
        pin: 5000,
        cpu: 'Snapdragon 888',
        back_camera: '12MP',
        front_camera: '12MP',
        idProduct: '2'
    },
    {
        _id: '3.1',
        price: 25,
        sale: 5,
        description: 'Iphone 12 Pro Max 256GB',
        color: 'blue',
        quantity: 1000,
        ram: 8,
        rom: 256,
        screen: "6.5",
        pin: 5000,
        cpu: 'Snapdragon 888',
        back_camera: '12MP',
        front_camera: '12MP',
        idProduct: '3'
    },
    {
        _id: '3.2',
        price: 25,
        sale: 5,
        description: 'Iphone 12 Pro Max 256GB',
        color: 'red',
        quantity: 1000,
        ram: 8,
        rom: 256,
        screen: "6.5",
        pin: 5000,
        cpu: 'Snapdragon 888',
        back_camera: '12MP',
        front_camera: '12MP',
        idProduct: '3'
    },
    {
        _id: '4.1',
        price: 25,
        sale: 5,
        description: 'Iphone 12 Pro Max 256GB',
        color: 'blue',
        quantity: 1000,
        ram: 8,
        rom: 256,
        screen: "6.5",
        pin: 5000,
        cpu: 'Snapdragon 888',
        back_camera: '12MP',
        front_camera: '12MP',
        idProduct: '4'
    },
    {
        _id: '4.2',
        price: 25,
        sale: 5,
        description: 'Iphone 12 Pro Max 256GB',
        color: 'red',
        quantity: 1000,
        ram: 8,
        rom: 256,
        screen: "6.5",
        pin: 5000,
        cpu: 'Snapdragon 888',
        back_camera: '12MP',
        front_camera: '12MP',
        idProduct: '4'
    }

];

const review = [
    {
        _id: '1',
        content: 'Sản phẩm rất tốt',
        rating: 5,
        idUser: '64624ff0f1376a12315830b4',
        idProduct: '1',
    },
    {
        _id: '2',
        content: 'Sản phẩm rất tốt',
        rating: 4,
        idUser: '64624ff0f1376a12315830b4',
        idProduct: '1',
    },
    {
        _id: '3',
        content: 'Sản phẩm rất tốt',
        rating: 5,
        idUser: '64624ff0f1376a12315830b4',
        idProduct: '2',
    },
    {
        _id: '4',
        content: 'Sản phẩm rất tốt',
        rating: 4,
        idUser: '64624ff0f1376a12315830b4',
        idProduct: '3',
    },
    {
        _id: '5',
        content: 'Sản phẩm rất tốt',
        rating: 5,
        idUser: '64624ff0f1376a12315830b4',
        idProduct: '4',
    },
    {
        _id: '2',
        content: 'Sản phẩm rất tốt',
        rating: 4,
        idUser: '64624ff0f1376a12315830b4',
        idProduct: '1',
    },
];


