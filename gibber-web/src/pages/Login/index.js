import React from 'react';
import {CenteredContent, Logo, Row, Divider, Button} from "../../utils/sharedStyles";
import TextInput from "../../components/TextInput";
import {useNavigate, Link} from "react-router-dom";
import Api from '../../config/axios';
import {toast} from "react-toastify";
// import {detectBrowser, getOsName, randomStr} from "../../utils/helpers";
// import io from "socket.io-client";
// import constants from "../../config/constants";
import DropdownInput from '../../components/DropdownInput';
import PhoneInput from 'react-phone-input-2';
import PasswordChecklist from 'react-password-checklist';
import 'react-phone-input-2/lib/style.css'
import './index.css';

function Login() {
  const [loginType, setLoginType] = React.useState(0);
  const [name, setName] = React.useState('');
  const [lang, setLang] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  // const [qrCode, setQrCode] = React.useState('');
  const [isValid, setIsValid] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      Api.setToken(token);
      navigate('/app/chat');
    }
    // getQrCode();
  }, [navigate]);

  React.useEffect(() => {
    setEmail('');
    setPhone('');
    setPassword('');
  }, [loginType]);

  React.useEffect(() => {
    const hasDigit = /\d/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    setIsValid(hasDigit && hasUppercase && password.length >= 8);
  }, [password])

  // const getQrCode = React.useCallback(async () => {
  //   const secret = randomStr();
  //   const res = await Api.post('/user/qr', {secret});
  //   setQrCode(res.data.src);
  //   let socket = io(constants.base_url, {transports : ['websocket'], query: {secret}});
  //   socket.on('qrLoginToken', async token => {
  //     localStorage.setItem('token', token);
  //     Api.setToken(token);
  //     await Api.put('/user/device', {device: `${getOsName()} - ${detectBrowser()}`});
  //     navigate('/app/chat');
  //   })
  // }, [navigate]);

  const login = React.useCallback(async () => {
    try {
      const res = await Api.post('/user/login', {email, phone, password});
      localStorage.setItem('token', res.data.token);
      Api.setToken(res.data.token);
      navigate('/app/chat')
    } catch (e) {
      toast.warn(e.response.data.message);
    }
  }, [email, phone, password, navigate]);

  const signUp = React.useCallback(async () => {
    if (!(email.length !== 0 || phone.length > 4)){
      return toast.warn('Email or Phone Number required');
    }
    if (!isValid) {
      return toast.warn('Password is not valid!');
    }
    try {
      const res = await Api.post('/user', {name, email, phone, password, language: lang});
      localStorage.setItem('token', res.data.token);
      Api.setToken(res.data.token);
      navigate('/app/chat')
    } catch (e) {
      toast.warn(e.response.data.message);
    }
  }, [name, email, password, lang, phone, navigate, isValid]);


  return (
    <div className="container">
      <Link to="/"><Logo/></Link>
      {!loginType ?
        <CenteredContent>
          {/* <img src={qrCode} alt=""/> */}
          <Row align="center" style={{margin: '25px 0'}}>
            {/* <Divider/> */}
            {/* <h3 style={{margin: '10px'}}>OR</h3> */}
            {/* <Divider/> */}
          </Row>
          <Button onClick={() => setLoginType(1)} width={350}>Login With Phone</Button>
          <br/>
          <Button onClick={() => setLoginType(2)} width={350}>Login With Email</Button>
          <Row align="center" style={{margin: '25px 0'}}>
            <Divider/>
            <h3 style={{margin: '10px'}}>OR</h3>
            <Divider/>
          </Row>
          <Button onClick={() => setLoginType(3)} width={350}>Sign Up</Button>
        </CenteredContent>
        :
        loginType !== 3 ?
          <CenteredContent>
            <h3>Login With {loginType === 1 ? 'Phone' : 'Email'}</h3>
            {loginType === 1 ?
              <PhoneInput
              className="text-field"
              country={'us'}
              value={phone}
              onChange={setPhone}
            />
              :
              <TextInput placeholder="Email" type="email" value={email} onChange={setEmail} />
            }
            <TextInput placeholder="Password" type="password" value={password} onChange={setPassword} />
            <br/><br/>
            <Button onClick={login} width={350}>Login</Button>
          </CenteredContent>
          :
          <CenteredContent>
            <h3>Sign Up</h3>
            <TextInput placeholder="Name" value={name} onChange={setName} />
            <DropdownInput placeholder="Language"  value={lang} onChange={setLang} />
            <TextInput placeholder="Email" type="email" value={email} onChange={setEmail} />
            <PhoneInput
              className="text-field"
              country={'us'}
              value={phone}
              onChange={setPhone}
            />
            <TextInput placeholder="Password" type="password" value={password} onChange={setPassword} />
            <PasswordChecklist
                rules={["minLength", "number","capital"]}
                minLength={8}
                value={password}
            />
            <br/><br/>
            <Button onClick={signUp} width={350}>Sign Up</Button>
          </CenteredContent>
      }
    </div>
  )
}

export default Login;
