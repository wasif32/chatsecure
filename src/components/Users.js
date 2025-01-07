import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useContext, useEffect, useState } from "react";
import logo from "../live-chat_512px.png";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { myContext } from "./MainContainer";

function Users_Groups() {
  const { refresh, setRefresh } = useContext(myContext);
  const [users, setUsers] = useState([]);
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const nav = useNavigate();
  console.log(userData);

  if (!userData) {
    console.log("User not Authenticated");
    nav(-1);
  }

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };
    axios.get("http://localhost:5000/user/fetchUsers", config).then((data) => {
      setUsers(data.data);
    });
  }, [refresh]);

  const startChat = (user) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };
    axios
      .post("http://localhost:5000/chat/", { userId: user._id }, config)
      .then((data) => {
        // On success, navigate to the chat area with the chat_id and user name
        const chat_id = data.data._id;
        nav(`/app/chat/${chat_id}&${user.name}`);

        // Trigger refresh to update the Sidebar
        setRefresh(!refresh); // This triggers Sidebar to update the conversations
      })
      .catch((err) => {
        console.error("Error creating chat", err);
      });
  };

  return (
    <div className="list-container">
      <div className="ug-header">
        <img
          src={logo}
          style={{ height: "64px", width: "64px", marginLeft: "10px" }}
          alt="logo"
        />
        <p className="ug-title">Online Users</p>
        <IconButton
          onClick={() => {
            setRefresh(!refresh);
          }}
        >
          <RefreshIcon />
        </IconButton>
      </div>
      <div className="sb-search">
        <IconButton>
          <SearchIcon />
        </IconButton>
        <input placeholder="search" className="search-box" />
      </div>
      <div className="ug-list">
        {users.map((user, index) => {
          return (
            <div
              className="list-ten"
              key={index}
              onClick={() => {
                startChat(user); // Start a chat when the user clicks on a user
              }}
            >
              <p className="con-icon">{user.name[0]}</p>
              <p className="con-title">{user.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Users_Groups;
