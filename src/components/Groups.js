import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useContext, useEffect, useState } from "react";
import logo from "../live-chat_512px.png";
import RefreshIcon from "@mui/icons-material/Refresh";
import { data, useNavigate } from "react-router-dom";
import "./myStyles.css";
import { myContext } from "./MainContainer";
import axios from "axios";

function Users_Groups() {
  const { refresh, setRefresh } = useContext(myContext);
  const [groups, setGroups] = useState([]);
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const nav = useNavigate();

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
    axios.get("http://localhost:5000/chat/fetchGroups", config).then((data) => {
      setGroups(data.data);
    });
  }, [refresh]);

  return (
    <div className="list-container">
      <div className="ug-header">
        <img
          src={logo}
          style={{ height: "64px", width: "64px", marginLeft: "10px" }}
          alt="logo"
        />
        <p className="ug-title">Available Groups</p>
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
        {groups.map((group, index) => {
          return (
            <div className="list-ten" key={index}>
              <p className="con-icon">T</p>
              <p className="con-title">{group.chatName}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Users_Groups;
