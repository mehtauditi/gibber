import React from 'react';
import {View, SafeAreaView, Keyboard} from 'react-native';
import {Button, Header, Input, Text as TextComp} from "../../components";
import {FooterTextBtn, FooterText, LoginImg, ContentContainer, TextB} from './styles';
import * as Animatable from 'react-native-animatable';
import {useDispatch} from "react-redux";
import {register} from "../../redux/actions";
import DropDownPicker from 'react-native-dropdown-picker';
import languages from '../../utils/languages';
// import PasswordChecklist from 'react-password-checklist';
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
  // const navigate = useNavigate();

  // React.useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     Api.setToken(token);
  //     navigate('/app/chat');
  //   }
  //   // getQrCode();
  // }, [navigate]);


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
      alert('Please enter a valid password! \nMust have a minimum of 8 characters, including 1 number, and 1 capitalized letter.')
    }
    try {
      dispatch(register({name, email, phone, password, lang}))
    } catch (e) {
      console.log(e.response.data.message)
    }
  },[name, email, phone, password, lang]);

  // const renderLangs = () => {
  //   languages.forEach(l => console.log('langs', languages))
  // }

  return (
    <>
      <Header {...props} title="gibber" hideRight/>
      {!loginType ?
        <ContentContainer>
          <LoginImg/>
          <TextComp size="big" weight="900" style={{marginTop: "8%", marginBottom: "2%"}}>Sign Up</TextComp>
          <TextComp noFont>Simplying Communication</TextComp>
          <Button title="Create Your Account" style={{marginTop: 35,}} onPress={() => setLoginType(1)} />
        </ContentContainer>
        :
        <Animatable.View animation="fadeIn" style={{flex: 1}}>
          <View style={{padding: 20}}>
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
              onPress={renderLangs} />
            <Button title="Sign Up" onPress={signUp} style={{marginTop: 25}} />
          </View>
          {/* PasswordChecklist doesn't seem to like React Native? */}
          {/* <View>
                <PasswordChecklist
                rules={["minLength", "number","capital"]}
                minLength={8}
                value={password}/>
          </View> */}
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
