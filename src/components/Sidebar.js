import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { myContext } from "./MainContainer";
import { IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SearchIcon from "@mui/icons-material/Search";
import ConversationsItem from "./ConversationsItem";

function Sidebar() {
  const navigate = useNavigate();
  const { refresh, setRefresh } = useContext(myContext);
  const [conversations, setConversations] = useState([]);
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const user = userData;

  if (!userData) {
    console.log("User not Authenticated");
    navigate("/");
  }

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios
      .get("http://localhost:5000/chat/", config)
      .then((response) => {
        setConversations(response.data);
      })
      .catch((err) => {
        console.error("Error fetching conversations:", err);
      });
  }, [refresh]);

  return (
    <div className="sidebar-container">
      <div className="sb-header">
        <div>
          <IconButton onClick={() => navigate("/app/welcome")}>
            <AccountCircleIcon className={"icon"} />
          </IconButton>
        </div>
        <div>
          <IconButton onClick={() => navigate("users")}>
            <PersonAddIcon className={"icon"} />
          </IconButton>
          <IconButton onClick={() => navigate("groups")}>
            <GroupAddIcon className={"icon"} />
          </IconButton>
          <IconButton onClick={() => navigate("create-groups")}>
            <AddCircleIcon className={"icon"} />
          </IconButton>
          <IconButton
            onClick={() => {
              sessionStorage.removeItem("userData");
              navigate("/");
            }}
          >
            <ExitToAppIcon className={"icon"} />
          </IconButton>
        </div>
      </div>
      <div className="sb-search">
        <IconButton>
          <SearchIcon />
        </IconButton>
        <input placeholder="search" className="search-box" />
      </div>
      <div className="sb-conversations">
        {conversations.map((conversation, index) => {
          const otherUser = conversation.users.find(
            (user) => user._id !== userData._id
          );
          return (
            <div key={index}>
              <div
                className="conversation-container"
                onClick={() => {
                  navigate("chat/" + conversation._id + "&" + otherUser.name);
                }}
              >
                <p className="con-icon">{otherUser.name[0]}</p>
                <p className="con-title">{otherUser.name}</p>
                <p className="con-lastMessage">
                  {conversation.latestMessage?.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
