import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {theme} from "../../config/theme";
import {ThemeProvider} from "styled-components";
import { useOutletContext} from "react-router-dom";
import { CenteredContent, Button, Logo } from "../../utils/sharedStyles";
import {AvatarButton, Container, Divider, TextField} from "./styles";
import PasswordChecklist from 'react-password-checklist';
import Api from "../../config/axios";
import "./index.css";
import { toast } from "react-toastify";
import FileUpload from "../../components/FileUpload";
import { RowItem} from "../../components/Chat/styles";
import {getAvatarPath} from "../../utils/helpers";
import {useOutsideAlerter} from "../../utils/useOutsideAlerter";

function MyProfile(props) {
  const location = useLocation();
  const userData = location.state;
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

  const handleChangeUserName = (event) => {
    setUsername(event.target.value)
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

useEffect(async () => {
  let imag = await getAvatarPath(userData.avatar);
  setAvatar(imag);
}, [userData.avatar])

  return (
    <ThemeProvider theme={mode === 'dark' ? theme.dark : theme.light}>
    <Container>
      <div style={{padding: '20px'}}>
        <NavLink to="/app/chat" className="back-to-chat">
          Return To Chat
        </NavLink>
      </div>
      <CenteredContent>
          <FileUpload accept="image/*" onChange={handleAvatarChange}>
            <RowItem>
                <AvatarButton src={avatar}/>
            </RowItem>
          </FileUpload>

        <h2 style={{ marginTop: "20px", marginBottom: '5px' }}>Account Information</h2>
        <Divider style={{width: '250px', marginBottom: 20}}/>
        <div className="user-container">
          <TextField>
            <h4>Display Name:</h4>
            <input
              style={{ display: "inline-block" }}
              value={username}
              onChange={handleChangeUserName}
            ></input>
          </TextField>
          <div className="email-info">
            <h4>Email Address:</h4>
            <h5 style={{ display: "inline-block" }}>{userData.email}</h5>
          </div>
          <div className="phone-info">
            <h4>Phone Number:</h4>
            <h5 style={{ display: "inline-block" }}>{!userData.phone ? 'None' : userData.phone}</h5>
          </div>
          <div className="language-info">
            <h4>Language:</h4>
            <h5 style={{ display: "inline-block" }}>{userData.language}</h5>
          </div>
        </div>
        <h2 style={{marginBottom: '5px'}}>Change Password</h2>
        <Divider style={{width: '250px', marginBottom: 20}}/>
        <div className="password-container">
          <TextField>
            <h4>Current Password: </h4>
            <input
              type="password"
              value={password.currentPassword}
              name="currentPassword"
              onChange={handlePasswordChange}
            ></input>
          </TextField>
          <TextField>
            <h4>New Password:</h4>
            <input
              type="password"
              value={password.newPassword}
              name="newPassword"
              onChange={handlePasswordChange}
            ></input>
            <PasswordChecklist
                rules={["minLength", "number","capital"]}
                minLength={8}
                value={password.newPassword}
            />
            <br />
            <h4>Confirm Password:</h4>
            <input
              type="password"
              value={password.confirmPassword}
              name="confirmPassword"
              onChange={handlePasswordChange}
            ></input>
          </TextField>
          <Button
            className="update-profile"
            onClick={handleProfileUpdateSubmit}
          >
            Update Profile
          </Button>
        </div>
      </CenteredContent>
    </Container>
    </ThemeProvider>
  );
}

export default MyProfile;
