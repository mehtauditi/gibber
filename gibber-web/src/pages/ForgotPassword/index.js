import React from 'react';
import {CenteredContent, Logo, Row, Divider, Button} from "../../utils/sharedStyles";
import {Container, HomeText, LeftSection} from "./styles";
import TextInput from '../../components/TextInput';
import {useNavigate, Link} from "react-router-dom";
import Api from '../../config/axios';
import {toast} from "react-toastify";
import PhoneInput from 'react-phone-input-2';
import PasswordChecklist from 'react-password-checklist';
import 'react-phone-input-2/lib/style.css'
import './styles.css';



export default function ForgotPassword() {
    const [dataType, setDataType] = React.useState(0);
    const[email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const navigate = useNavigate();

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          Api.setToken(token);
          navigate('/app/chat');
        }
        // getQrCode();
      }, [navigate]);


    const passwordResetSender = React.useCallback(async () => {
        //Checks for email format (Reused from Login index.js)
        // if(!(/\S+@\S+\.\S+/.test(email))){
        //     return toast.warn('Valid email is required!')
        //   
          try {
            const res = await Api.get(`/user/allUsers`);
            toast.success('If an account exists with that email it will be sent shortly');
            console.log(res);
          } catch (e) {
            toast.warn(e.response.data.message);
          }

    });


    // app.post('/user/forgotPassword', async (req, res, next) => {
    //     const { emailOrPhone } = req.body;
    //     try {
    //       const user = await User.findOne({ $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] });
    //       if (!user) {
    //         return res.status(404).json({ message: 'User not found.' });
    //       }
    //       const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    //       const resetLink = `https://example.com/reset-password/${token}`;
    //       // send reset password link to user's email or phone number
    //       res.json({ message: 'Instructions to reset your password have been sent to your email or phone number.' });
    //     } catch (error) {
    //       next(error);
    //     }
    //   });
    

    return (
        <div className="container">
            <Link to="/"><Logo/></Link>
            <CenteredContent>
                <h3>Forgot your password?</h3>
                <h5>Enter the email associated with your Gibber account!</h5>
                <br></br>
                <TextInput type="email" placeholder="Email" value={email} onChange={setEmail} />
                <br></br>
                <Button onClick={passwordResetSender}>Send Reset Code</Button>
            </CenteredContent>
        </div>
    )
}