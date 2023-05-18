import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const UpdateProfile = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.img}
          source={require('../../../../assets/images/back.png')} ></Image>
        <Text style={styles.title}>Update profile</Text>
      </View>

      <View style={styles.body}>
        <TextInput
          style={styles.input}
          placeholder="Name"></TextInput>


        <TextInput
          style={styles.input}
          placeholder="Birthday"></TextInput>


        <TextInput
          style={styles.input}
          placeholder="Address"></TextInput>

        <TextInput
          style={styles.input}
          placeholder="Email"></TextInput>

        <TextInput
          style={styles.input}
          placeholder="Phone number"></TextInput>

        <Pressable style={styles.btn}>
          <Text style={styles.txtBtn}>Submit</Text>
        </Pressable>
      </View>

      <View style={styles.footer}></View>
    </View>
  )
}

export default UpdateProfile

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
  input: {
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