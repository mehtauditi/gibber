import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {ToastContainer} from 'react-toastify';
import {ChatRoom, Home, Login} from "./pages";
import useDimensions from "./utils/useDimensions";
import {Layout} from "./components";
import 'react-toastify/dist/ReactToastify.css';
import MyProfile from './pages/MyProfile';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Realm from "realm-web";


function App() {
  const {height} = useDimensions();

  const app = new Realm.App({ id: 'gibber-chat-yahnd' });

  return (
    <div className="App" style={{height}}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/>}/>
          <Route path="app" element={<Layout/>}>
            <Route path="login" element={<Login mongoApp={app}/>}/>
            <Route path="chat" element={<ChatRoom/>}/>
            <Route exact path="myprofile" element={<MyProfile/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer/>
    </div>
  );
}

export default App;
