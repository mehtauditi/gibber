import React, { useEffect } from 'react';
import {Alert, View, Text} from "react-native";
import {Button, Header, Icon, Input} from "../../components";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Head, Row, IconBtn, Avatar, InputContainer, AvatarContainer, LogoutBtn} from './styles';
import {getImageFromLibrary} from "../../utils/imagePicker";
import {logout, updateAvatarSuccess, updateProfile} from "../../redux/actions";
import {getAvatarPath, getFileObj, getUploadHeaders} from "../../utils/helpers";
import constants from "../../config/constants";
import {Api} from "../../config";

const Profile = (props) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [avatar, setAvatar] = React.useState('');
  const user = useSelector(state => state.main.user.data);
  const dispatch = useDispatch();

  React.useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setAvatar(user.avatar);
  }, [user]);

  const updateProfileData = React.useCallback(() => {
    if (!(email.length > 0 && phone.length > 4)) {
      return alert('Please enter an email and phone number!')
    }
    if(!(/\S+@\S+\.\S+/.test(email))){
      return alert('Valid email is required!')
    }
    if (!name) {
      return alert('Please enter your name!')
    }
    dispatch(updateProfile({name, email, phone}))
  }, [name, email, phone]);


  const uploadImage = React.useCallback(async () => {
    const imageFile = await getImageFromLibrary();
    if (imageFile.uri) {
      setAvatar(imageFile.uri);
      let data = new FormData();
      data.append('file', getFileObj(imageFile));
      let obj = {method: 'PUT', headers: await getUploadHeaders(), body: data};
      const res = await (await fetch(constants.base_url + '/api/v1/user/avatar', obj)).json();
      dispatch(updateAvatarSuccess(res.path));
      Alert.alert('Successful', 'Avatar updated')
    }
  }, []);

  const useLogout = React.useCallback(async () => {
    await AsyncStorage.removeItem('token');
    Api.setToken('');
    props.navigation.replace('Login');
    dispatch(logout());
  }, []);

  return (
    <View style={{flex: 1}}>
      <Header title="Profile" showBack titleStyle={{top: 1}}/>
      <KeyboardAwareScrollView contentContainerStyle={{padding: 25}}>
        <Head>
          <AvatarContainer>
            <Avatar source={getAvatarPath(avatar)} />
            <IconBtn onPress={uploadImage}><Icon name="camera-outline" size={20} color="#fff" /></IconBtn>
          </AvatarContainer>
        </Head>
        <Row>
          <Icon name="person" size={25} />
          <InputContainer><Input label="Name" value={name} onChange={setName} /></InputContainer>
        </Row>
        <Row>
          <Icon name="phone" size={25} />
          <InputContainer><Input label="phone" value={phone} onChange={setPhone} keyboardType="phone-pad" /></InputContainer>
        </Row>
        <Row>
          <Icon name="email" size={25} />
          <InputContainer><Input label="email" value={email} onChange={setEmail} /></InputContainer>
        </Row>
        <Row style={{top: 0, justifyContent: 'center'}}>
          <Text onPress={() => props.navigation.navigate('ChangePassword')} style={{textDecorationLine: 'underline', color: '#4d87c8'}}>Change Password</Text>
          {/* <Button onPress={() => props.navigation.navigate('ChangePassword')} style={{marginBottom: 20}} title="Change Password"></Button> */}
        </Row>
        <Row></Row>
        
        {/* <Text style={{marginBottom: 15}}>*Note: To update your password, Go to https://www.gibber.chat</Text> */}
        <Button onPress={updateProfileData} title="Update" disabled={!name || !email || !phone} />
        <LogoutBtn onPress={useLogout}>Logout</LogoutBtn>
      </KeyboardAwareScrollView>
    </View>
  )
};

export default Profile;
