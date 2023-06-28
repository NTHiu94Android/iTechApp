import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, FlatList, RefreshControl } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../users/UserContext';
import { AppContext } from '../../AppContext';

import Swiper from 'react-native-swiper';
import ProgressDialog from 'react-native-progress-dialog';

const Home = (props) => {
    const { navigation } = props;
    const { } = useContext(UserContext);
    const { onGetCategories, onGetProducts, onGetSubProducts, onGetReviews, countOrderDetail } = useContext(AppContext);

    const [listCategory, setListCategory] = useState(cate);

    const [ListSale, setListSale] = useState([]);
    const [ListPhone, setListPhone] = useState([]);
    const [ListLaptop, setListLaptop] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [refreshing, setRefreshing] = useState(false);


    //Lay danh sach category
    useEffect(() => {
        setIsLoading(true);
        getData();
    }, [countOrderDetail]);

    const getData = async () => {
        setRefreshing(true);
        try {
            //console.log('objRef.current: ', objRef.current);

            const resProduct = await onGetProducts();
            const resCategory = await onGetCategories();
            const resReview = await onGetReviews();
            const resSubProduct = await onGetSubProducts();

            //Lay danh sach san pham
            if (!resProduct || !resCategory || !resReview || !resSubProduct ||
                !resProduct.data || !resCategory.data || !resReview.data || !resSubProduct.data
            ) {
                setIsLoading(false);
                return;
            }

            //Them sao va subProduct vao tung item
            let list1 = [];
            let list2 = [];
            let list3 = [];
            const listProduct = resProduct.data;
            listProduct.map(async (item) => {
                item.rating = await getStar(item._id, resReview);
                const subProduct = await onGetSubProductsByIdProduct(item._id, resSubProduct);
                item.subProduct = subProduct;
                //Lay danh sach san pham theo tung danh muc va add vao list danh muc do
                if (item.subProduct[0] == null || item.subProduct[0] == undefined) {
                    return;
                }
                if (item.subProduct[0].sale > 5) {
                    list1.push(item);
                }
                if (item.idCategory == '645cfd060405a873dbcdda9c') {
                    list2.push(item);
                }
                if (item.idCategory == '645cfcd60405a873dbcdda9a') {
                    list3.push(item);
                }
            });

            setListCategory(resCategory.data);
            setListSale(list1);
            setListPhone(list2);
            setListLaptop(list3);
        } catch (error) {
            console.log("Error home screen: ", error);
        }
        setIsLoading(false);
        setRefreshing(false);
    };

    //Lay danh sach subProduct theo idProduct
    const onGetSubProductsByIdProduct = async (idProduct, res) => {
        try {

            if (res == null || res == undefined) {
                return;
            } else {
                const subProduct = res.data.filter((item) => item.idProduct == idProduct);
                return subProduct;
            }
        } catch (error) {
            console.log('onGetSubProductsByIdProduct error: ', error);
        }
    };

    //Lay sao tu danh gia set vao tung item
    const getStar = async (idProduct, res) => {
        let star = 0;
        let count = 0;

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

    const gotoListProduct = (idCategory) => {
        const category = listCategory.filter((item) => item._id == idCategory);
        navigation.navigate('ListProduct', { category: category[0] });
    };

    const goToProductDetail = (idProduct) => {
        navigation.navigate('ProductDetail', { idProduct });
    };

    return (
        <View style={styles.container}>
            <ProgressDialog
                visible={isLoading}
                loaderColor="black"
                lable="Please wait..." />

            {/* Top bar */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12 }}>
                <TouchableOpacity onPress={()=>getData()}>
                    <Image
                        style={{ width: 22, height: 22 }}
                        resizeMode='cover'
                        source={require('../../../../assets/images/ic_home.png')} />
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
            <ScrollView 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={()=>getData()} />}
            >

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
                        // initialNumToRender={2} // Giới hạn số lượng phần tử hiển thị ban đầu
                        // maxToRenderPerBatch={1} // Giới hạn số lượng phần tử render mỗi lần
                        renderItem={({ item }) => <Item onPress={() => goToProductDetail(item._id)} item={item} />}
                        keyExtractor={item => item._id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                    {/* <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '800', textDecorationLine: 'underline' }}>See more &gt;</Text> */}
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
                        data={ListPhone}
                        renderItem={({ item }) => <Item onPress={() => goToProductDetail(item._id)} item={item} />}
                        keyExtractor={item => item._id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                    <TouchableOpacity onPress={()=> gotoListProduct('645cfd060405a873dbcdda9c')}>
                        <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '800', textDecorationLine: 'underline' }}>See more &gt;</Text>
                    </TouchableOpacity>
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
                        data={ListLaptop}
                        renderItem={({ item }) => <Item onPress={() => goToProductDetail(item._id)} item={item} />}
                        keyExtractor={item => item._id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                    <TouchableOpacity onPress={()=> gotoListProduct('645cfcd60405a873dbcdda9a')}>
                        <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '800', textDecorationLine: 'underline' }}>See more &gt;</Text>
                    </TouchableOpacity>
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
        // elevation: 5,
        // shadowColor: 'grey',
        borderRadius: 8,
        paddingBottom: 12,
        // shadowOffset: {
        //     width: 1,
        //     height: 3
        // },
        backgroundColor: '#F5F5F5',
        // shadowRadius: 5,
        // shadowOpacity: 0.3
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
        {
            item == null || item == undefined ? <View style={{ width: 160, height: 200, alignItems: 'center' }}></View> :
                <View style={styles.itemContainer}>
                    <View style={{ width: 160, height: '100%' }}>
                        <View style={styles.viewSaleDam}>
                            <Text style={{ fontSize: 16, color: 'white', fontWeight: '600', marginRight: 8 }}>Sale</Text>
                            <Text style={{ fontSize: 14, color: 'yellow', fontWeight: '400', fontFamily: 'Caveat' }}>Super big</Text>
                        </View>
                        <Image
                            style={{ width: '100%', height: 160, position: 'relative' }}
                            resizeMode='cover'
                            source={{ uri: item.image }} />
                        <Image
                            style={{ width: 35, height: 35, position: 'absolute', right: 13, top: 150 }}
                            resizeMode='cover'
                            source={require('../../../../assets/images/ic_shop.png')} />
                        <Text style={{ height: 19, color: 'black', fontWeight: '800', fontSize: 14, marginTop: 5, paddingHorizontal: 8, maxWidth: 130 }}>
                            {item.name}</Text>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 8 }}>
                            <Image
                                style={{ width: 15, height: 15, marginEnd: 5 }}
                                resizeMode='cover'
                                source={require('../../../../assets/images/ic_star.png')}
                            />
                            <Text style={{ fontWeight: '700' }}>{item.rating}</Text>
                        </View>

                        {
                            item.subProduct[0].sale > 0 ?
                                <View style={{ flexDirection: 'row', paddingHorizontal: 8 }}>
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
                                <Text style={{ height: 19, color: 'black', fontWeight: '700', fontSize: 14, lineHeight: 19.1, paddingHorizontal: 8 }}>
                                    Price: {item.subProduct[0].price} $
                                </Text>
                        }
                        <View style={{ flexDirection: 'row', paddingHorizontal: 8 }}>
                            <Image
                                style={{ width: 15, height: 15, marginEnd: 5 }}
                                resizeMode='cover'
                                source={require('../../../../assets/images/ic_cpu.png')}
                            />
                            <Text numberOfLines={1} style={{ fontWeight: '700', paddingEnd: 6 }}>CPU {item.subProduct[0].cpu}</Text>
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
        }

    </TouchableOpacity>
);

const data1 = [
    {
        "_id": "6463aec19f29e71381893790",
        "dateInput": "2023-06-23T06:00:06.656Z",
        "idBrand": "645d18122a262fd91c565577",
        "idCategory": "645cfcd60405a873dbcdda9a",
        "image": "https://cdn.tgdd.vn/Products/Images/44/303500/msi-gaming-gf63-thin-11sc-i5-664vn-123-glr-1-2.jpg",
        "name": "Laptop MSI Gaming GF63",
        "rating": 0,
        "subProduct": [
            {
                "__v": 0,
                "_id": "6463af289f29e71381893792",
                "color": "black",
                "cpu": "i511400H2.7GHz",
                "date": "2023-06-23T05:49:41.502Z",
                "description": "",
                "idProduct": "6463aec19f29e71381893790",
                "pin": 58,
                "price": 85,
                "quantity": 400,
                "ram": 8,
                "rom": 16,
                "sale": 33,
                "screen": "2560 x 1664 pixels - 13 inches"
            }
        ]
    },
    {
        "_id": "64631ef7b054109c4a42b757",
        "dateInput": "2023-06-23T06:00:07.172Z",
        "idBrand": "645d176c2a262fd91c56556f",
        "idCategory": "645cfcd60405a873dbcdda9a",
        "image": "https://images.fpt.shop/unsafe/fit-in/585x390/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/11/12/637408006342832761_mbp-2020-m1-silver-1.png",
        "name": "Macbook Pro 2022",
        "rating": 0,
        "subProduct": [
            {
                "__v": 0,
                "_id": "646328779dcc2f5fc8821f65",
                "color": "silver",
                "cpu": "Apple M2 tám nhân CPU",
                "date": "2023-06-23T05:49:40.020Z",
                "description": "",
                "idProduct": "64631ef7b054109c4a42b757",
                "pin": 58,
                "price": 125,
                "quantity": 296,
                "ram": 8,
                "rom": 16,
                "sale": 10,
                "screen": "2560 x 1664 pixels - 13 inches"
            },
            {
                "__v": 0,
                "_id": "646328949dcc2f5fc8821f69",
                "color": "gold",
                "cpu": "Apple M2 tám nhân CPU",
                "date": "2023-06-23T05:49:40.275Z",
                "description": "",
                "idProduct": "64631ef7b054109c4a42b757",
                "pin": 58,
                "price": 125,
                "quantity": 296,
                "ram": 8,
                "rom": 16,
                "sale": 10,
                "screen": "2560 x 1664 pixels - 13 inches"
            }
        ]
    },
    {
        "_id": "6463b63cd0f76ed2bb92bc1d",
        "dateInput": "2023-06-23T06:00:07.786Z",
        "idBrand": "6463a74cd3dbf3f315fb97a2",
        "idCategory": "645cfd060405a873dbcdda9c",
        "image": "https://cdn.tgdd.vn/Products/Images/42/213031/iphone-12-tim-1-600x600.jpg",
        "name": "Iphone 12 ",
        "rating": 0,
        "subProduct": [
            {
                "__v": 0,
                "_id": "6463b77dd0f76ed2bb92bc1f",
                "color": "purple",
                "cpu": "Apple A14 Bionic hexa-core",
                "date": "2023-06-23T05:49:43.037Z",
                "description": "",
                "idProduct": "6463b63cd0f76ed2bb92bc1d",
                "pin": 3279,
                "price": 434,
                "quantity": 300,
                "ram": 4,
                "rom": 65,
                "sale": 10,
                "screen": "Super Retina XDR OLED, kích thước 6.1 inch, độ phân giải 2532 x 1170 pixel"
            },
            {
                "__v": 0,
                "_id": "6463b877d0f76ed2bb92bc2d",
                "color": "black",
                "cpu": "Apple A14 Bionic hexa-core",
                "date": "2023-06-23T05:49:43.344Z",
                "description": "",
                "idProduct": "6463b63cd0f76ed2bb92bc1d",
                "pin": 3279,
                "price": 434,
                "quantity": 300,
                "ram": 4,
                "rom": 65,
                "sale": 10,
                "screen": "Super Retina XDR OLED, kích thước 6.1 inch, độ phân giải 2532 x 1170 pixel"
            },
            {
                "__v": 0,
                "_id": "6463b922d0f76ed2bb92bc3d",
                "color": "red",
                "cpu": "Apple A14 Bionic hexa-core",
                "date": "2023-06-23T05:49:43.652Z",
                "description": "",
                "idProduct": "6463b63cd0f76ed2bb92bc1d",
                "pin": 3279,
                "price": 434,
                "quantity": 300,
                "ram": 4,
                "rom": 65,
                "sale": 10,
                "screen": "Super Retina XDR OLED, kích thước 6.1 inch, độ phân giải 2532 x 1170 pixel"
            },
            {
                "__v": 0,
                "_id": "6463bac8d0f76ed2bb92bc4f",
                "color": "green",
                "cpu": "Apple A14 Bionic hexa-core",
                "date": "2023-06-23T05:49:43.959Z",
                "description": "",
                "idProduct": "6463b63cd0f76ed2bb92bc1d",
                "pin": 3279,
                "price": 434,
                "quantity": 300,
                "ram": 4,
                "rom": 65,
                "sale": 10,
                "screen": "Super Retina XDR OLED, kích thước 6.1 inch, độ phân giải 2532 x 1170 pixel"
            },
            {
                "__v": 0,
                "_id": "6463bbbad0f76ed2bb92bc63",
                "color": "blue",
                "cpu": "Apple A14 Bionic hexa-core",
                "date": "2023-06-23T05:49:44.265Z",
                "description": "",
                "idProduct": "6463b63cd0f76ed2bb92bc1d",
                "pin": 3279,
                "price": 434,
                "quantity": 300,
                "ram": 4,
                "rom": 65,
                "sale": 10,
                "screen": "Super Retina XDR OLED, kích thước 6.1 inch, độ phân giải 2532 x 1170 pixel"
            }
        ]
    }
];

const cate = [
    { "__v": 0, "_id": "645cfcd60405a873dbcdda9a", "image": "https://fptshop.com.vn/Uploads/Originals/2022/7/11/637931467519964702_hp-15s-fq-bac-win11-dd.jpg", "name": "Laptop" },
    { "__v": 0, "_id": "645cfd060405a873dbcdda9c", "image": "https://assets.swappie.com/cdn-cgi/image/width=600,height=600,fit=contain,format=auto/swappie-iphone-14-pro-max-gold.png?v=34", "name": "Smartphone" },
    { "__v": 0, "_id": "645cfd550405a873dbcdda9e", "image": "https://cdn.shopify.com/s/files/1/0997/6284/files/nav-noise-colorfit-loop-smartwatch.png?v=18114716816441478335", "name": "Smart watch" },
    { "__v": 0, "_id": "645cfdad0405a873dbcddaa0", "image": "https://www.popsci.com/uploads/2023/03/14/best-tablet-college-samsung-galaxy.jpg?auto=webp", "name": "Tablet" },
    { "__v": 0, "_id": "645d05fcd462c8e4783df253", "image": "https://www.lg.com/in/images/tvs/md07554883/gallery/55UQ7500PSF-D-2.jpg", "name": "TV" }
];


