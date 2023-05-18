import { StyleSheet, Text, View, TextInput, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useEffect, useContext, useRef } from 'react'

import { AppContext } from '../../AppContext';
import back from '../../../back/back';

const DimensionsW = Dimensions.get('window').width;

const SearchScreen = (props) => {
  const { navigation } = props;
  const { onGetProducts, onGetSubProducts, onGetReviews } = useContext(AppContext);
  const [listSearch, setListSearch] = useState([]); //list search
  const [listName, setListName] = useState([]); //list name product
  const [name, setName] = useState('');
  const listProductRef = useRef([]);
  back(navigation);

  useEffect(() => {
    const getListProduct = async () => {
      const res = await onGetProducts();
      const resSubProduct = await onGetSubProducts();
      const resReview = await onGetReviews();
      const list = res.data;
      //Them sao va subProduct vao tung item
      for (let i = 0; i < list.length; i++) {
        list[i].rating = await getStar(list[i]._id, resReview);
        const subProduct = await onGetSubProductsByIdProduct(list[i]._id, resSubProduct);
        list[i].subProduct = subProduct;
      }
      listProductRef.current = list;
    };
    getListProduct();
  }, []);

  useEffect(() => {
    const getListName = async () => {
      setListSearch([]);
      const list = listProductRef.current.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));
      let list2 = [];
      for (let i = 0; i < list.length; i++) {
        list2.push(list[i].name);
      }
      if (name === '' || name === null) return setListName([]);
      setListName(list2);
    }
    getListName();
  }, [name]);

  const getListSearch = async (listProduct, name) => {
    if (name === null || name === '') return setListSearch([]);
    const list = listProduct.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));
    setListSearch(list);
    setListName([]);
  }

  const handleClickItem = (item) => {
    getListSearch(listProductRef.current, item);
    setListName([]);
  }

  const handleClickClear = () => {
    setName('');
    setListName([]);
  }

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

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{ width: 22, height: 22 }}
            resizeMode='cover'
            source={require('../../../../assets/images/back.png')} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
          <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>Search</Text>

        </View>

        <View style={{ width: 22, height: 22 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter name product"
            clearButtonMode="never"
            style={styles.input} />
          <TouchableOpacity style={styles.btnSearch} onPress={() => getListSearch(listProductRef.current, name)}>
            <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>Search</Text>
          </TouchableOpacity>
        </View>
        {
          name != '' && name != null ?
            <TouchableOpacity style={{ position: 'absolute', right: 120, top: 10 }} onPress={() => handleClickClear()}>
              <Image source={require('../../../../assets/images/del.png')} style={{ width: 20, height: 20 }} />
            </TouchableOpacity> : null
        }

        {
          listName.length > 0 ?
            listName.map((item, index) =>
              <TouchableOpacity
                key={index} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' }}
                onPress={() => handleClickItem(item)}
              >
                <Text style={{ color: 'black', fontSize: 16 }}>{item}</Text>
              </TouchableOpacity>
            ) : null
        }


        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {
            listSearch && listSearch.length > 0 ?
              listSearch.map((item) =>
                <Item key={item._id} item={item} onPress={() => navigation.navigate('ProductDetail', { productItem: item })} />
              ) : null
          }
        </View>
      </ScrollView>
    </View>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: DimensionsW - 128,
    borderWidth: 1,
    borderColor: '#333',
    padding: 10,
    borderRadius: 10,
    paddingRight: 36,
    position: 'relative',
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
  },
  iconTopBar: {
    width: 24, height: 24,
  },
  textProfile: {
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
    fontWeight: '800',
  },
  btnSearch: {
    width: 100,
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const Item = ({ item, onPress }) => (
  <TouchableOpacity style={{ flexWrap: 'wrap', width: '49%', marginVertical: 10 }} onPress={onPress}>
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
          <Text numberOfLines={1} style={{ fontWeight: '700' }}>CPU {item.subProduct[0].cpu}</Text>
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