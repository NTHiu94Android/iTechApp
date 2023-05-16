import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'

import ProgressDialog from 'react-native-progress-dialog';
import Swiper from 'react-native-swiper';

import ProductSortDialog from './ProductSortDialog';
import { AppContext } from '../../AppContext';
import back from '../../../back/back';

const ListProduct = ({ navigation, route }) => {
  back(navigation);
  const { category } = route.params;
  const { onGetBrandsByIdCategory, onGetProducts, onGetSubProducts, onGetReviews } = useContext(AppContext);
  const [listBrand, setListBrand] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [visibleSort, setVisibleSort] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [idSelected, setIdSelected] = useState('all');

  useEffect(() => {
    const getData = async () => {
      //Lay danh sach san pham theo idCategory
      getProductsByIdCategory();

      //Lay danh sanh thuong hieu theo idCategory
      const res = await onGetBrandsByIdCategory(category._id);
      if (res.data !== null || res.data !== undefined) {
        setListBrand(res.data);
      }
    };
    getData();
  }, []);

  //Lay tat ca san pham theo idCategory
  const getProductsByIdCategory = async () => {
    setIsLoading(true);
    setIdSelected('all');
    const res = await onGetProducts();
    if (res.data !== null || res.data !== undefined) {
      //Loc danh sach san pham theo idCategory
      const list = res.data;
      let listFilter = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i].idCategory === category._id) {
          list[i].rating = await getStar(list[i]._id);
          const subProduct = await onGetSubProductsByIdProduct(list[i]._id);
          list[i].subProduct = subProduct;
          listFilter.push(list[i]);
        }
      }

      setListProduct(listFilter);
    }
    setIsLoading(false);
  };

  //Lay danh sach san pham theo idBrand va idCategory
  const getProductsByIdBrandAndIdCategory = async (idBrand) => {
    setIsLoading(true);
    setIdSelected(idBrand);
    //Loc san pham theo idBrand va idCategory
    const res = await onGetProducts();
    const list = res.data;
    let listFilter = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].idBrand === idBrand && list[i].idCategory === category._id) {
        list[i].rating = await getStar(list[i]._id);
        const subProduct = await onGetSubProductsByIdProduct(list[i]._id);
        list[i].subProduct = subProduct;
        listFilter.push(list[i]);
      }
    }
    
    setListProduct(listFilter);
    setIsLoading(false);
  };

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

  const showDialogSort = () => {
    setVisibleSort(true);
  };

  const onSort = (sort) => {
    setVisibleSort(false);
    console.log(sort);
    if (sort === 'down') {
      const sortedProducts = listProduct.sort((a, b) => b.price - a.price);
      setListProduct(sortedProducts);
    } else if (sort === 'up') {
      const sortedProducts = listProduct.sort((a, b) => a.price - b.price);
      setListProduct(sortedProducts);
    }
    // }else if(sort === 'rate'){
    //     const sortedProducts = listProduct.sort((a, b) => a.reviews - b.reviews);
    //     setListProduct(sortedProducts);
    // }

  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ProgressDialog
        visible={isLoading}
        loaderColor="black"
        lable="Please wait..." />

      <View style={styles.container}>

        {/* Top bar */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={{ width: 22, height: 22 }}
              resizeMode='cover'
              source={require('../../../../assets/images/back.png')} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
            <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>{category.name}</Text>

          </View>

          <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
            <Image
              style={{ width: 22, height: 22 }}
              resizeMode='cover'
              source={require('../../../../assets/images/ic_search.png')} />
          </TouchableOpacity>
        </View>

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

          <ScrollView style={{ margin: 10, height: 56, }} horizontal={true} showsHorizontalScrollIndicator={false}>
            {/* All */}
            <TouchableOpacity
              style={idSelected === 'all' ? styles.itemBrandSelected : styles.itemBrand}
              onPress={() => getProductsByIdCategory()}>
              <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                <Image
                  style={{ width: 44, height: 40 }}
                  resizeMode='cover'
                  source={require('../../../../assets/images/ic_all.png')} />
                {/* <Text>All</Text> */}
              </View>
            </TouchableOpacity>
            {
              listBrand ? listBrand.map((item) => {
                return (
                  <TouchableOpacity
                    key={item._id}
                    style={idSelected === item._id ? styles.itemBrandSelected : styles.itemBrand}
                    onPress={() => getProductsByIdBrandAndIdCategory(item._id)}>
                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Image
                        style={{ width: 40, height: 40 }}
                        resizeMode='stretch'
                        source={{ uri: item.image }} />
                    </View>
                  </TouchableOpacity>
                )
              }) : <View />
            }
          </ScrollView>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16, marginRight: 30 }}>
            <TouchableOpacity onPress={() => showDialogSort()}>
              <Text style={{ color: 'black', fontWeight: '600', fontSize: 14, textDecorationLine: 'underline' }}>Sort by</Text>
            </TouchableOpacity>
          </View>

          {
            visibleSort ? <ProductSortDialog onSort={onSort} isVisible={visibleSort} /> : null
          }

          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginHorizontal: 10 }}>
            {
              listProduct ?
                listProduct.map((item) =>
                  <Item key={item._id} item={item} onPress={() => navigation.navigate('ProductDetail', { productItem: item })} />
                ) : null
            }
          </View>
        </ScrollView>

      </View>
    </View>
  )
}

export default ListProduct

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
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
  },
  itemBrand: {
    borderRadius: 8, borderWidth: 1,
    borderColor: '#ddd', padding: 8,
    width: 56, height: 56, marginEnd: 8,
  },
  itemBrandSelected: {
    borderRadius: 8, borderWidth: 1,
    borderColor: 'black', padding: 8,
    width: 56, height: 56, marginEnd: 8,
  },
});

const Item = ({ item, onPress }) => (
  <TouchableOpacity style={{ flexWrap: 'wrap', width: '49%', marginBottom: 10 }} onPress={onPress}>
    <View style={styles.itemContainer}>
      <View style={{ width: '100%', height: '100%' }}>
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
        <Text numberOfLines={1} style={{ height: 19, color: 'black', fontWeight: '800', fontSize: 16, marginTop: 5, marginHorizontal: 8, maxWidth: '90%' }}>
          {item.name}
        </Text>
        <View style={{ flexDirection: 'row', paddingHorizontal: 8, marginTop: 5 }}>
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
          <Text numberOfLines={1} style={{ fontWeight: '700' }}>CPU {item.subProduct[0].cpu}</Text>
        </View>

        <View style={{ flexDirection: 'row', paddingHorizontal: 8 }}>
          <Image
            style={{ width: 15, height: 15, marginEnd: 5 }}
            resizeMode='cover'
            source={require('../../../../assets/images/ic_ram.png')}
          />
          <Text style={{ fontWeight: '700' }}>Ram {item.subProduct[0].ram} GB</Text>
        </View>

        <View style={{ flexDirection: 'row', paddingHorizontal: 8 }}>
          <Image
            style={{ width: 15, height: 15, marginEnd: 5 }}
            resizeMode='cover'
            source={require('../../../../assets/images/ic_rom.png')}
          />
          <Text style={{ fontWeight: '700' }}>Rom {item.subProduct[0].rom} GB</Text>
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