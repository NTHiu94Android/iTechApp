import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ToastAndroid } from 'react-native';
import Modal from 'react-native-modal';

const DialogChangCount = ({ handleCountChange, isVisible, max }) => {
    const [number, setNumber] = useState(1);

    const handleSetCount = (value) => {
        value = parseInt(value);
        if (value > max) {
            ToastAndroid.show(`The number of products is not enough, Only ${max} products left`, ToastAndroid.SHORT);
            return;
        }
        if (value < 1) {
            ToastAndroid.show("The number of products must be greater than 0", ToastAndroid.SHORT);
            return;
        }
        handleCountChange(value);
    }

    return (
        <Modal isVisible={isVisible} backdropOpacity={0.5}>
            <View style={styles.container}>
                <Text style={{ textAlign: 'center', fontWeight: '800', fontSize: 16, color: 'black' }}>Change quantity</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setNumber}
                    value={number.toString()}
                    keyboardType="numeric"
                />

                <TouchableOpacity style={styles.sortButton} onPress={() => handleSetCount(number)}>
                    <Text style={{ color: 'white', fontWeight: '800', fontSize: 16, textAlign: 'center' }}>OK</Text>
                </TouchableOpacity>

            </View>
        </Modal>
    )
}

export default DialogChangCount

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
    },
    sortOption: {
        paddingVertical: 8,
    },
    sortButton: {
        backgroundColor: 'black',
        borderRadius: 8,
        padding: 12,
        marginTop: 16,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
    }
})