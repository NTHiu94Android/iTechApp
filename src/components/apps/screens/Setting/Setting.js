import { Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useContext } from 'react';
import { UserContext } from '../../../users/UserContext';
import back from '../../../back/back';

import ProgressDialog from 'react-native-progress-dialog';

const Setting = (props) => {
  const { navigation } = props;
  back(navigation);
  const { user, onLogout } = useContext(UserContext);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const handleEditPassword = () => {
    navigation.navigate('EditPassword');
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const res = await onLogout(user._id);
      if (res) {
        console.log('Logout success');
      } else {
        console.log('Error when logout');
      }
      setIsLoading(false);
    } catch (error) {
      console.log('Error when logout: ', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <ProgressDialog
        visible={isLoading}
        loaderColor="black"
        label="Please wait..." />
      <View style={styleSetting.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, paddingHorizontal: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={{ width: 22, height: 22 }}
              resizeMode='cover'
              source={require('../../../../assets/images/back.png')} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
            <Text style={{ color: 'black', fontWeight: '800', fontSize: 18 }}>Settings</Text>
          </View>
          <View style={{ width: 22, height: 22 }} />
        </View>

        {/* body */}
        <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: 'white', flex: 1, marginTop: 20 }}>
          {/* Personal Information */}
          <View style={styleSetting.viewPersonalInformation}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
              <Text style={styleSetting.txtPersonalInformation}>Personal Information</Text>
              <View>
                <TouchableOpacity onPress={() => navigation.navigate('UpdateProfile')}>
                  <Image
                    style={styleSetting.icEdit1}
                    source={require('../../../../assets/images/edit.png')}
                    resizeMode="cover">
                  </Image>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text style={[styleSetting.txtName, { marginTop: 15 }]}>Name:</Text>
              <Text style={styleSetting.txtNameUser}>{user.name}</Text>

              <Text style={[styleSetting.txtName, { marginTop: 15 }]}>Email</Text>
              <Text style={styleSetting.txtNameUser}>{user.email}</Text>
            </View>

          </View>

          {/* Password */}
          <View style={styleSetting.viewPersonalInformation}>
            <View style={styleSetting.viewPassword}>
              <Text style={styleSetting.txtPersonalInformation}>Password</Text>
              <View>
                <TouchableOpacity onPress={() => handleEditPassword()}>
                  <Image
                    style={styleSetting.icEdit1}
                    source={require('../../../../assets/images/edit.png')}
                    resizeMode="cover">
                  </Image>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styleSetting.txtName}>Name:</Text>
            <Text style={styleSetting.txtNameUser}>*******</Text>
          </View>

          {/* Notification */}
          <View style={styleSetting.viewPersonalInformation}>
            <Text style={styleSetting.txtPersonalInformation}>Notifications</Text>
            <View style={styleSetting.viewSales}>
              <Text style={styleSetting.txtSales}>Sales</Text>
              <View>
                <Switch
                  trackColor={{ false: '#767577', true: '#228B22' }}
                  thumbColor={isEnabled ? '#ffffff' : '#ffffff'}
                  onValueChange={toggleSwitch}
                  value={isEnabled}></Switch>
              </View>
            </View>
          </View>

          {/* Help Center */}
          <View style={styleSetting.viewPersonalInformation}>
            <Text style={[styleSetting.txtPersonalInformation, { marginBottom: 10 }]}>Help Center</Text>

            <TouchableOpacity style={styleSetting.btnFAQ}>
              <Text style={styleSetting.txtFAQ}>FAQ</Text>
              <Image
                style={styleSetting.icEdit1}
                source={require('../../../../assets/images/next.png')}
                resizeMode="cover"></Image>
            </TouchableOpacity>

            <TouchableOpacity style={styleSetting.btnFAQ}>
              <Text style={styleSetting.txtFAQ}>Contact Us</Text>
              <Image
                style={styleSetting.icEdit1}
                source={require('../../../../assets/images/next.png')}
                resizeMode="cover"></Image>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleLogout()} style={styleSetting.btnFAQ}>
              <Text style={styleSetting.txtFAQ}>Log out</Text>
              <Image
                style={styleSetting.icEdit1}
                source={require('../../../../assets/images/next.png')}
                resizeMode="cover"></Image>
            </TouchableOpacity>

          </View>
        </ScrollView>


      </View>
    </View>
  )
}

export default Setting

const styleSetting = StyleSheet.create({
  txtFAQ: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
  btnFAQ: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'white',
    marginVertical: 8
  },
  footer: {
    flex: 1,
    // backgroundColor: 'red',
  },
  //

  //body
  txtSales: {
    fontSize: 15,
    marginTop: 15,
    color: 'black',
  },
  viewSales: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  viewNotifications: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  txtNameUser: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
  txtName: {
    fontSize: 14,
    marginBottom: 5,
  },
  viewName: {
    height: 65,
    borderRadius: 5,
    backgroundColor: 'white',
    marginVertical: 10,
  },
  icEdit1: {
    width: 16,
    height: 16,
    alignItems: 'center',

  },
  viewPassword: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  body: {
    // backgroundColor: 'blue',
  },
  //

  /* //** */
  //** */
  //header
  txtNameUser: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
  txtName: {
    fontSize: 14,
    marginBottom: 5,
  },
  viewName: {
    height: 65,
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: 'white',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    marginVertical: 10,
    elevation: 5,
  },
  icEdit1: {
    width: 16,
    height: 16,
    alignItems: 'center',

  },
  txtPersonalInformation: {
    fontSize: 16,
    fontWeight: '800'
  },
  viewPersonalInformation: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    padding: 12,
    marginTop: 10,
    backgroundColor: 'white',
    elevation: 5,
    shadowOffset: {
      width: 1,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    marginBottom: 6,
  },
  txtOrderDetail: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  txtOrderDetail2: {
    width: 16
  },
  icBack: {
    width: 16,
    height: 16,
  },
  viewHeader: {
    flexDirection: 'row',
    marginHorizontal: 15,
    justifyContent: 'space-between',
  },
  header: {
    // backgroundColor: 'green', 
    marginBottom: 10,
  },
  //

  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})