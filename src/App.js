import React from "react";
import "./App.css";
import MainContainer from "./components/MainContainer";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import Welcome from "./components/Welcome";
import ChatArea from "./components/ChatArea";
import Users from "./components/Users";
import CreateGroups from "./components/CreateGroups";
import Groups from "./components/Groups";
import Signup from "./components/SignUp";

function App() {
  return (
    <div className="App">
      {/* <MainContainer /> */}
      {/* <Login /> */}
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="app" element={<MainContainer />}>
          <Route path="welcome" element={<Welcome />} />
          <Route path="chat/:_id" element={<ChatArea />} />
          <Route path="users" element={<Users />} />
          <Route path="groups" element={<Groups />} />
          <Route path="create-groups" element={<CreateGroups />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
