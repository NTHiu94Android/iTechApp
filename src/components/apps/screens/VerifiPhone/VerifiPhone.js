import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useState, useRef } from 'react';
import Modal from 'react-native-modal';

const VerifiPhone = ({isVisible, setIsShowDialog, addAddress, updateNumberPhone, confirm, numberPhone}) => {
    //const { user, setUser } = useContext(UserContext);
    // If null, no SMS has been sent
    const inputRefs = useRef([]);
    const [code, setCode] = useState('');

    const focusNextInput = (index) => {
        if (inputRefs.current[index]) {
            inputRefs.current[index].focus();
        }
    };

    const handleTextChange = (text, index) => {
        if (text.length === 1) {
            focusNextInput(index + 1);
            setCode(code + text);
        } else if (text.length === 0 && index > 0) {
            focusNextInput(index - 1);
            //Xoa ky tu vi tri index
            const newCode = code.substring(0, code.length - 1);
            setCode(newCode);
        } else {
            setCode(code.substring(0, code.length - 1));
        }
    };

    const renderInputs = () => {
        const inputs = [];

        for (let i = 0; i < 6; i++) {
            inputs.push(
                <TextInput
                    key={i}
                    ref={(ref) => (inputRefs.current[i] = ref)}
                    style={styles.input}
                    maxLength={1}
                    keyboardType="numeric"
                    onChangeText={(text) => handleTextChange(text, i)}
                />
            );
        }

        return inputs;
    };

    const confirmCode = async () => {
        try {
            console.log('code: ', code);
            const res = await confirm.confirm(code);
            if(res.user){
                console.log('>>>>>>>>>>>>User: ', res.user);
                ToastAndroid.show('Verifi OTP successfully!', ToastAndroid.SHORT);
                //setIsShowDialog(false);
                await updateNumberPhone(numberPhone);
                if(addAddress){
                    await addAddress();
                }
            }else{
                ToastAndroid.show('Verifi OTP failed!', ToastAndroid.SHORT);
                //setIsShowDialog(false);
            }
        } catch (error) {
            console.log('Invalid code.', error);
            ToastAndroid.show('Invalid code!', ToastAndroid.SHORT);
            setIsShowDialog(false);
        }
    }

    return (
        <Modal isVisible={isVisible} backdropColor='white' backdropOpacity={1}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, marginTop: 30 }}>
                <TouchableOpacity onPress={() => setIsShowDialog(false)}>
                    <Image
                        style={{ width: 22, height: 22 }}
                        resizeMode='cover'
                        source={require('../../../../assets/images/back.png')} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
                    <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>Verification numberphone</Text>

                </View>

                <TouchableOpacity>
                    <View style={{ width: 22, height: 22 }} />
                </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100%'}}>
            <Image
                source={require('../../../../assets/images/verifi.png')}
                style={{ width: 200, height: 200, marginTop: 30}}
            />

            {/* View code */}
            <View style={{ flexDirection: 'row', alignSelf: 'center', marginBottom: 20 }}>
                {renderInputs()}
            </View>
            <TouchableOpacity
                style={{ alignSelf: 'center', backgroundColor: 'black', padding: 10, paddingHorizontal: 50, borderRadius: 30 }}
                onPress={()=>confirmCode()}>
                <Text style={{fontWeight: '800', fontSize: 16, color: 'white'}}>Confirm code</Text>
            </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default VerifiPhone

const styles = StyleSheet.create({
    input: {
        width: 50,
        height: 50,
        margin: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        borderRadius: 10,
    }
})