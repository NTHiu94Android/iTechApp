import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import Modal from 'react-native-modal';

const DialogPromotion = ({ showModal, handleSelectPromotion, listPromotion, cancel }) => {
    //console.log('listPromotion: ', listPromotion);
    const handleClick = (item) => {
        handleSelectPromotion(item);
    }
    return (
        <Modal
            isVisible={showModal} backdropColor='white' backdropOpacity={1}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }}>
                <TouchableOpacity onPress={cancel}>
                    <Image
                        style={{ width: 22, height: 22 }}
                        resizeMode='cover'
                        source={require('../../../../assets/images/back.png')} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>Choose voucher</Text>
                </View>
                <View style={{ width: 22, height: 22 }} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {
                    listPromotion.length == 0 ?
                        <Text style={{  fontWeight: '500', fontSize: 14, textAlign: 'center' }}>
                            No promotion available
                        </Text> :
                        listPromotion.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => handleClick(item)}>
                                    <View style={{ flexDirection: 'row', padding: 12, borderColor: '#ddd', borderWidth: 1, marginTop: 8, borderRadius: 8 }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: 'black', fontWeight: '900', fontSize: 20, marginBottom: 12 }}>{item.content}</Text>
                                            <View style={{ flexDirection: 'row' }}>

                                                <Image
                                                    style={{ width: 120, height: 100, borderRadius: 8, marginRight: 12 }}
                                                    resizeMode='cover'
                                                    source={{ uri: 'https://kids.royalfashion.vn/wp-content/uploads/2020/03/sale.jpg' }}
                                                />
                                                <View>
                                                    <Text style={{ color: 'black', fontWeight: '600', fontSize: 14 }}>Sale off {item.sale}%</Text>
                                                    <Text style={{ color: 'red', fontWeight: '600', fontSize: 14 }}>Max sale {item.maxSale}$</Text>

                                                    <Text style={{ color: 'black', fontWeight: '800', fontSize: 14 }}>Code: {item.code}</Text>
                                                    <Text style={{ color: 'black', fontWeight: '400', fontSize: 14 }}>Condition: orders from {item.condition}</Text>
                                                    <Text style={{ color: 'black', fontWeight: '400', fontSize: 14 }}>Expires later: {item.expirateDate} day</Text>
                                                </View>
                                            </View>

                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                }
                <TouchableOpacity style={styles.sortButton} onPress={cancel}>
                    <Text style={{ color: 'white', fontWeight: '800', fontSize: 16, textAlign: 'center' }}>Cancel</Text>
                </TouchableOpacity>
            </ScrollView>
        </Modal>
    )
}

export default DialogPromotion

const styles = StyleSheet.create({
    sortButton: {
        backgroundColor: 'black',
        borderRadius: 30,
        width: 150,
        paddingVertical: 8,
        marginTop: 16,
        alignSelf: 'center',
    },
});