import React from "react";
import logo from "../live-chat_512px.png";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const nav = useNavigate();
  if (!userData) {
    console.log("User not authenticated");
    nav("/");
  }

  return (
    <div className="welcome-container">
      <img src={logo} alt="Logo" className="welcome-logo" />
      <b>Hi,{userData.name}</b>
      <p>View and text directly to people present in the Chat Rooms.</p>
    </div>
  );
}

export default Welcome;
