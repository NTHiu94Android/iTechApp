import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';

const Setting = (props) => {
  const { navigation } = props;
  return (
    <View style={styles.container}>
      {/* Action bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image style={styles.icon} source={require('../../../../assets/images/back2.png')} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.text}>Setting</Text>
        </View>
      </View>

      {/* Personal Information */}
      <View style={{ height: 180, justifyContent: 'space-between' }}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Personal Information</Text>
          <Image style={styles.editIcon} source={require('../../../../assets/images/edit-2.png')} />
        </View>

        {/* Name */}
        <View style={styles.area}>
          <View style={styles.areaContent}>
            <Text style={styles.nameTitle}>Name</Text>
            <Text style={styles.nameText}>Tín Phạm</Text>
          </View>
        </View>

        {/* Email */}
        <View style={styles.area}>
          <View style={styles.areaContent}>
            <Text style={styles.nameTitle}>Email</Text>
            <Text style={styles.nameText}>tinpqps19513@gmail.com</Text>
          </View>
        </View>
      </View>

      {/* Eit Password */}
      <View style={{ marginTop: 40, height: 101, justifyContent: 'space-between' }}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Password</Text>
          <Image style={styles.editIcon} source={require('../../../../assets/images/edit-2.png')} />
        </View>

        {/* Password */}
        <View style={styles.area}>
          <View style={styles.areaContent}>
            <Text style={styles.nameTitle}>Password</Text>
            <Text style={styles.nameText}>************</Text>
          </View>
        </View>
      </View>

      {/* Notifications */}
      <View style={{ marginTop: 35, height: 87, justifyContent: 'space-between' }}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Notifications</Text>
        </View>

        {/* Checkbox */}
        <View style={styles.area_1}>
          <View style={styles.areaContent_1}>
            <Text style={styles.nameTitle_1}>Sales</Text>
            <Image style={{ width: 40, height: 24 }} source={require('../../../../assets/images/on-button.png')} />
          </View>
        </View>
      </View>

      {/* Help Center */}
      <View style={{ marginTop: 22, height: 219, justifyContent: 'space-between' }}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Help Center</Text>
        </View>

        {/* FAQ */}
        <View style={styles.area}>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.viewInfo}>
              <Text style={styles.buttonText}>FAQ</Text>
            </View>
            <TouchableOpacity>
              <Image
                style={styles.editIcon}
                resizeMode='cover'
                source={require('../../../../assets/images/next2.png')} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Us */}
        <View style={styles.area}>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.viewInfo}>
              <Text style={styles.buttonText}>Contact Us</Text>
            </View>
            <TouchableOpacity>
              <Image
                style={styles.editIcon}
                resizeMode='cover'
                source={require('../../../../assets/images/next2.png')} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Log out */}
        <View style={styles.area}>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.viewInfo}>
              <Text style={styles.buttonText}>Log out</Text>
            </View>
            <TouchableOpacity>
              <Image
                style={styles.editIcon}
                resizeMode='cover'
                source={require('../../../../assets/images/next2.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#242424',
  },
  areaContent_1: {
    height: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  areaContent: {
    height: 40,
    justifyContent: 'space-between',
  },
  nameText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#242424',
  },
  nameTitle: {
    fontWeight: '400',
    fontSize: 12,
    color: '#808080',
  },
  nameTitle_1: {
    fontWeight: '600',
    fontSize: 16,
    color: '#242424',
    textAlignVertical: 'center',
  },
  area: {
    height: 64,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#DBDBDB',
    shadowOpacity: 1,
    shadowRadius: 50,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
  },
  area_1: {
    height: 54,
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowOpacity: 1,
    shadowRadius: 50,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
  },
  editIcon: {
    width: 24,
    height: 24,
  },
  titleText: {
    fontWeight: '600',
    fontSize: 16,
  },
  title: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  actionBar: {
    height: 44,
    marginBottom: 20,
    backgroundColor: 'red',
    position: 'relative',
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  backButton: {
    position: 'absolute',
    left: 16,
  },
  icon: {
    width: 20,
    height: 20,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#303030',
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
});

export default Setting;
