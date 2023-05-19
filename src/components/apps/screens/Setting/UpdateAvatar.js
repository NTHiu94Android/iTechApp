import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const UpdateAvatar = () => {
    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <Pressable style={styles.btn}>
                    <Text style={styles.txtBtn}>Camera</Text>

                </Pressable>
                <Pressable style={styles.btn}>
                    <Text style={styles.txtBtn}>Upload photo</Text>
                </Pressable>
                <Pressable style={styles.btnCancel}>
                    <Text style={styles.txtBtn}>Cancel</Text>

                </Pressable>
            </View>
        </View>
    )
}

export default UpdateAvatar

const styles = StyleSheet.create({
    footer: {
        flex: 0.5,

    },
    txtBtn: {
        color: 'white',
        fontSize: 16,
      },
      btnCancel: {
        marginVertical: 25,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 300,
        borderRadius: 10,
        backgroundColor: 'black',
      },
    btn: {
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 300,
        borderRadius: 10,
        backgroundColor: 'black',
      },
    body: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flex: 0.5,
    },
    container: {
        flex: 1,
    },
})