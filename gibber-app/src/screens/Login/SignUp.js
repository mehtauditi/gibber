import React from 'react';
import {View, SafeAreaView, Keyboard} from 'react-native';
import {Button, Header, Input, Text as TextComp} from "../../components";
import {LanguageSelectModal} from "./styles";
import {FooterTextBtn, FooterText, LoginImg, ContentContainer, TextB} from './styles';
import * as Animatable from 'react-native-animatable';
import {useDispatch} from "react-redux";
import {register} from "../../redux/actions";
// import ToastManager, {Toast} from "toastify-react-native";

const SignUp = (props) => {
  const [loginType, setLoginType] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [lang, setLang] = React.useState('');
  const [footerVisible, setFooterVisible] = React.useState(true);
  const [isValid, setIsValid] = React.useState('');

  const dispatch = useDispatch();

  React.useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => setFooterVisible(false));
    Keyboard.addListener('keyboardDidHide', () => setFooterVisible(true));
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    }
  }, []);

  React.useEffect(() => {
    const hasDigit = /\d/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    setIsValid(hasDigit && hasUppercase && password.length >= 8);
  }, [password])

  const signUp = React.useCallback(() => {
    if (!(email.length > 0 && phone.length > 4)) {
      // React Native version of Toastify is currently buggy?
      alert('Please enter an email and phone number!')
    }
    if (!name) {
      alert('Please enter your name!')
    }
    if (!password || !isValid) {
      alert('Please enter a valid password!')
    }
    try {
      dispatch(register({name, email, phone, password, lang}))
    } catch (e) {
      console.log(e.response.data.message)
    }
  },[name, email, phone, password, lang]);

  return (
    <>
      <Header {...props} title="gibber" hideRight/>
      {!loginType ?
        <ContentContainer>
          <LoginImg/>
          <TextComp size="big" weight="900" style={{marginTop: "8%", marginBottom: "2%"}}>Sign Up</TextComp>
          <TextComp noFont>Simplying Communication</TextComp>
          <Button title="Create Your Account" style={{marginTop: 35,}} onPress={() => setLoginType(1)} />
          {/* <Button title="Sign up with email" style={{marginVertical: 15}} onPress={() => setLoginType(2)} /> */}
        </ContentContainer>
        :
        <Animatable.View animation="fadeIn" style={{flex: 1}}>
          <View style={{padding: 20}}>
            {/* <TextComp size="larger" weight="900">Sign up with {loginType === 1 ?'phone' : 'email'}</TextComp> */}
            <Input label="Name" value={name} onChange={setName} />
            <Input label="Phone" value={phone} onChange={setPhone} keyboardType="phone-pad" />
            <Input label="Email" value={email} onChange={setEmail} keyboardType="email-address" autoCapitalize={"none"} />
            <Input label="Password" value={password} onChange={setPassword} secureTextEntry />
            <Button 
              title="Choose Your Language" 
              value={lang} 
              lang={lang} 
              setLang={setLang}
              style={{marginTop: "10%", marginBottom: "10%"}} 
              onPress={() => {return <ContentContainer><View><LanguageSelectModal/></View></ContentContainer>}} />
            <Button title="Sign Up" onPress={signUp} style={{marginTop: 25}} />
          </View>
        </Animatable.View>
      }
      {footerVisible ? <FooterTextBtn onPress={() => props.navigation.goBack()}>
        <SafeAreaView>
          <FooterText><TextB>Have an account?</TextB> Login</FooterText>
        </SafeAreaView>
      </FooterTextBtn> : null}
    </>
  )
};

export default SignUp;
