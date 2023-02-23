import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button, Divider, Logo } from "../../utils/sharedStyles";
import Api from "../../config/axios";
import "./index.css";
import { toast } from "react-toastify";

function MyProfile(props) {
  const location = useLocation();
  const userData = location.state;

  let [username, setUsername] = useState(userData.name);
  let [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });


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

  return (
    <div>
      <div style={{padding: '20px'}}>
        <NavLink to="/app/chat" className="back-to-chat">
          Return To Chat
        </NavLink>
      </div>
      <form className="container">
        <Logo/>
        <h2 style={{ marginTop: "20px", marginBottom: '5px' }}>Account Information</h2>
        <Divider style={{width: '250px'}}/>
        <div className="user-container">
          <div className="user-info">
            <h4>Display Name</h4>
            <input
              style={{ display: "inline-block" }}
              value={username}
              onChange={handleChangeUserName}
            ></input>
          </div>
          <div className="email-info">
            <h4>Email Address</h4>
            <h5 style={{ display: "inline-block" }}>{userData.email}</h5>
          </div>
          <div className="phone-info">
            <h4>Phone Number</h4>
            <h5 style={{ display: "inline-block" }}>{!userData.phone ? 'None' : userData.phone}</h5>
          </div>
          <div className="language-info">
            <h4>Language</h4>
            <h5 style={{ display: "inline-block" }}>{userData.language}</h5>
          </div>
        </div>
        <h2 style={{marginBottom: '5px'}}>Change Password</h2>
        <Divider style={{width: '250px'}}/>
        <div className="password-container">
          <div className="old-password">
            <h4>Current Password </h4>
            <input
              type="password"
              value={password.currentPassword}
              name="currentPassword"
              onChange={handlePasswordChange}
            ></input>
          </div>
          <div className="new-password">
            <h4>New Password</h4>
            <input
              type="password"
              value={password.newPassword}
              name="newPassword"
              onChange={handlePasswordChange}
            ></input>
            <br />
            <h4>Confirm Password</h4>
            <input
              type="password"
              value={password.confirmPassword}
              name="confirmPassword"
              onChange={handlePasswordChange}
            ></input>
          </div>
          <Button
            className="update-profile"
            onClick={handleProfileUpdateSubmit}
          >
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
}

export default MyProfile;
