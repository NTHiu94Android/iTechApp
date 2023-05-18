import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const EditPassword = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.img}
          source={require('../../../../assets/images/back.png')} ></Image>
        <Text style={styles.title}>Update password</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.viewInput}>
          <TextInput
            style={styles.input}
            keyboardType='password'
            placeholder="Current password"></TextInput>

          <Pressable>
            <Image
              style={styles.icon}
              source={require('../../../../assets/images/blind.png')} >
            </Image>
          </Pressable>
        </View>

        <View style={styles.viewInput}>
          <TextInput
            style={styles.input}
            keyboardType='password'
            placeholder="New password"></TextInput>

          <Pressable>
            <Image
              style={styles.icon}
              source={require('../../../../assets/images/blind.png')} >
            </Image>
          </Pressable>
        </View>

        <View style={styles.viewInput}>
          <TextInput
            style={styles.input}
            keyboardType='password'
            placeholder="Retype password"></TextInput>

          <Pressable>
            <Image
              style={styles.icon}
              source={require('../../../../assets/images/blind.png')} >
            </Image>
          </Pressable>
        </View>

        <Pressable style={styles.btn}>
          <Text style={styles.txtBtn}>Submit</Text>
        </Pressable>
      </View>

      <View style={styles.footer}></View>
    </View>
  )
}

export default EditPassword

const styles = StyleSheet.create({
  footer: {
    flex: 0.5,
  },

  // body
  txtBtn: {
    color: 'white',
    fontSize: 16,
  },
  btn: {
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 150,
    borderRadius: 10,
    backgroundColor: 'black',
  },
  viewInput: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    width: 16,
    height: 16,
    position: 'absolute',
    alignItems: 'flex-end',
  },
  input: {
    position: 'relative',

    paddingHorizontal: 15,
    height: 40,
    width: 300,
    borderBottomWidth: 1,
    marginVertical: 15,

  },
  txtTitle: {

  },
  body: {
    flex: 5,
    marginVertical: 20,
    alignItems: 'center',
  },


  // header

  title: {
    marginHorizontal: 25,
    fontWeight: 'bold',
    color: 'black',
    fontSize: 18,
  },
  img: {
    width: 16,
    height: 16,
  },
  header: {
    marginHorizontal: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 0.5,
    flexDirection: 'row',

  },
  container: {
    flex: 1,
  },

})