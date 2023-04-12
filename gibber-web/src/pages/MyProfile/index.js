import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {theme} from "../../config/theme";
import {ThemeProvider} from "styled-components";
import { useOutletContext} from "react-router-dom";
import {Button, CenteredContent, Logo, Row} from "../../utils/sharedStyles";
import {CustomCheckbox, Container, Divider, TextField, ProfileHeader, ProfileForm, CenteredDiv} from "./styles";
import PasswordChecklist from 'react-password-checklist';
import Api from "../../config/axios";
import "./index.css";
import { toast } from "react-toastify";
import FileUpload from "../../components/FileUpload";
import {getAvatarPath} from "../../utils/helpers";
import {useOutsideAlerter} from "../../utils/useOutsideAlerter";
import {Icon, Switch} from "../../components";
import DropdownInput from "../../components/DropdownInput";
import {languages} from "../../utils/languages";

function MyProfile(props) {
  const location = useLocation();
  const userData = location.state;

  // This state variable will keep track of whether the component is in edit mode or not,
  // if true user is allowed to edit the profile
  const [isEditMode, setIsEditMode] = useState(false);

  const [toggle, setToggle] = useState(userData.translateUser);
  const [avatar, setAvatar] = useState(getAvatarPath(userData.avatar));
  const [username, setUsername] = useState(userData.name);
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [mode, setMode] = useOutletContext();
  const [actionsVisible, setActionsVisible] = React.useState(false);
  const actionsRef = React.useRef(null);
  useOutsideAlerter(actionsRef, () => setActionsVisible(false));

  const handleProfileUpdateSubmit = async () => {
    if (!username || username.trim() === '') {
      toast.warn('Invalid name');
      return;
    }
    if (username !== userData.name) {
      await Api.put(`/user`, { name: username } );
    }
    if (!password.newPassword && !password.confirmPassword && !password.currentPassword) {
      toast.success('Profile Updated');
      return;
    }
    if (password.newPassword === password.confirmPassword) {
      try {
        await Api.put(`/user/password/${userData._id}`, { userNewPassword: password.newPassword, userOldPassword: password.currentPassword });
      } catch (error) {
        toast.warn("Invalid password or mismatched")
        return;
      }
    }else if (password.newPassword !== password.confirmPassword) {
      toast.warn("Invalid password or mismatched");
      return;
    }
    toast.success('Profile Updated');
    setPassword({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if(isEditMode){
      handleProfileUpdateSubmit();
    }
  }

  const handleChangeUserName = (event) => {
    setUsername(event.target.value);
  };

  const handleCheckboxChange = async (event) => {
    console.log(event.target.checked);
    setToggle(event.target.checked);
    await Api.put(`/user/translateUser`, { translateUser: event.target.checked } );
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPassword({ ...password, [name]: value });
  };

  const handleAvatarChange = (source) => {
    const uri = URL.createObjectURL(source);
    let data = {['image']: uri};
    const formData = new FormData();
    formData.append('file', source);
    Api.put(`/user/avatar`, formData)
        .then((res) => {
          toast.success("Avatar Updated");
          setAvatar(getAvatarPath(res.data.path));
          return res.data.path;
        })
        .catch((error) => {
          toast.error("Error");
        });
  }

  const nullFunction = () => {
    toast.warn('Sorry language change is not available yet')
  }

  useEffect(async () => {
    let imag = await getAvatarPath(userData.avatar);
    setAvatar(imag);
  }, [userData.avatar])

  return (
      <ThemeProvider theme={mode === 'dark' ? theme.dark : theme.light}>
        <ProfileHeader>
          <NavLink to="/app/chat" className="back-to-chat" style={{alignSelf:"flex-start"}}>
            <Icon style={{position:'fixed'}}name="arrow-back-outline" size={40} color={'gray'}/>
          </NavLink>
        </ProfileHeader>
        <Container>
            <CenteredContent>
              <div className='avatar-container'>
                <div className='outer'>
                  <img src={avatar} className='image' style={{height: '200px', width: '200px', borderRadius:"50%"}}/>
                  <div className='inner'>
                    <FileUpload accept="image/*" onChange={handleAvatarChange}>
                      <Icon name="edit-outline" size={25} color={'white'}/>
                    </FileUpload>
                  </div>
                </div>
              </div>
              <h1>Account Information</h1>
            </CenteredContent>
            {isEditMode ? (
                <CenteredDiv>
                  <div className='element-container'>
                    <h3 className='element-label'>Name</h3>
                    <TextField>
                      <input type='text' name='username' placeholder={userData.name} onChange={handleChangeUserName}/>
                    </TextField>
                  </div>
                  <Divider style={{background:'gray', width:'90%', height:'1px'}}/>
                  <div className='element-container' style={{paddingTop:'0px'}}>
                    <h3 className='element-label' style={{paddingTop:'35px'}}>Language</h3>
                    <h3 className='element-label' style={{paddingTop:'35px', textAlign:'left'}}>{(languages.find(value => value.language === userData.language)).name}</h3>
                    {/*<DropdownInput onChange={nullFunction}/>*/}
                  </div>
                  <div className='element-container' style={{paddingTop:'15px', justifyContent:'left', marginLeft:'25px'}}>
                    <h4 className='element-label' style={{paddingRight:'35px', paddingTop:'10px'}}>Translate my messages</h4>
                      <div className="form-check form-switch" style={{display:'flex'}}>
                        <input
                              className="form-check-input"
                              checked={Boolean(toggle)}
                              type="checkbox"
                              role="switch"
                              id="flexSwitchCheckDefault"
                              onChange={handleCheckboxChange}
                              style={{display:'inline-flex', width:'40px', height:'20px'}}
                          />
                      </div>
                  </div>
                  <Divider style={{background:'gray', width:'90%', height:'1px'}}/>
                  <h2 className='element-label'>Change Password</h2>
                  <div className='element-container'>
                    <h3 className='element-label'>Current Password</h3>
                    <TextField>
                      <input type='password' value={password.currentPassword} name='currentPassword' onChange={handlePasswordChange}/>
                    </TextField>
                  </div>
                  <div className='element-container'>
                    <h3 className='element-label'>New Password</h3>
                    <TextField>
                      <input type='password' value={password.newPassword} name='newPassword' onChange={handlePasswordChange}/>
                    </TextField>
                  </div>
                  <div className='element-container' style={{alignContent:'center'}}>
                      <PasswordChecklist
                          rules={["minLength", "number","capital"]}
                          minLength={8}
                          value={password.newPassword}
                      />
                      <br/>
                    </div>
                  <div className='element-container'>
                    <h3 className='element-label'>Confirm Password</h3>
                    <TextField>
                      <input type='password' value={password.confirmPassword} name='confirmPassword' onChange={handlePasswordChange}/>
                    </TextField>
                  </div>
                </CenteredDiv>
            ):(
                <CenteredDiv className="form-container" style={{width:'75%'}}>
                  <div className='element-container'>
                    <h2 className='element-label' style={{color:'gray'}}>Name</h2>
                    <h2 className='element-label' >{userData.name}</h2>
                  </div>
                  <Divider style={{background:'gray', width:'90%', height:'1px'}}/>
                  <div className='element-container'>
                    <h2 className='element-label' style={{color:'gray'}}>Email</h2>
                    <h2 className='element-label'>{userData.email}</h2>
                  </div>
                  <Divider style={{background:'gray', width:'90%', height:'1px'}}/>
                  <div className='element-container'>
                    <h2 className='element-label' style={{justifyContent:'left', color:'gray'}}>Phone</h2>
                    <h2 className='element-label'>{userData.phone}</h2>
                  </div>
                  <Divider style={{background:'gray', width:'90%', height:'1px'}}/>
                  <div className='element-container'>
                    <h2 className='element-label' style={{justifyContent:'left', color:'gray'}}>Language</h2>
                    <h2>{(languages.find(value => value.language === userData.language)).name}</h2>
                  </div>
                </CenteredDiv>
            )}
          <div style={{display:'flex', paddingTop:'25px', justifyContent:'center', paddingBottom:'25px'}}>
            <button className="rounded-button" onClick={toggleEditMode}>{isEditMode ? 'Save' : 'Edit'}</button>
          </div>
        </Container>
      </ThemeProvider>
  );
}
export default MyProfile;
