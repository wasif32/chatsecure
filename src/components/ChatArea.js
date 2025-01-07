import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React, { useContext, useEffect, useRef, useState } from "react";
import MessageOthers from "./MessageOthers";
import MessageSelf from "./MessageSelf";
import { useParams } from "react-router-dom";
import axios from "axios";
import { myContext } from "./MainContainer";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
var socket;

function ChatArea() {
  const [messageContent, setMessageContent] = useState("");
  const messagesEndRef = useRef(null);
  const { _id } = useParams();
  const [chat_id, chat_user] = _id.split("&");
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  const [allMessages, setAllMessages] = useState([]);
  const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setLoaded] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (!messageContent.trim()) return;

    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };

    const newMessage = {
      sender: { _id: userData._id, name: userData.name },
      content: messageContent, // Display the original message content
      createdAt: new Date().toISOString(),
    };

    setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    scrollToBottom();

    axios
      .post(
        "http://localhost:5000/message/",
        { content: messageContent, chatId: chat_id },
        config
      )
      .then(({ data }) => {
        setAllMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg === newMessage ? { ...msg, _id: data._id } : msg
          )
        );
        socket.emit("newMessage", data);
      })
      .catch((err) => {
        setAllMessages((prevMessages) =>
          prevMessages.filter((msg) => msg !== newMessage)
        );
      });

    setMessageContent("");
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);

    const handleMessageReceived = (newMessage) => {
      setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("message received", handleMessageReceived);

    return () => {
      socket.off("message received", handleMessageReceived);
      socket.disconnect();
    };
  }, [userData]);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };

    axios
      .get("http://localhost:5000/message/" + chat_id, config)
      .then(({ data }) => {
        setAllMessages(data);
        setLoaded(true);
        scrollToBottom();
        socket.emit("join-chat", chat_id);
      })
      .catch((err) => console.error("Error fetching messages:", err));
  }, [refresh, chat_id, userData.token]);

  useEffect(() => {
    if (loaded) {
      scrollToBottom();
    }
  }, [allMessages, loaded]);

  return (
    <div className="chatArea-container">
      <div className="chatArea-header">
        <p className="con-icon">{chat_user[0]}</p>
        <div className="header-text">
          <p className="con-title">{chat_user}</p>
        </div>
      </div>
      <div className="messages-container">
        {allMessages.map((message, index) => {
          const sender = message.sender;
          const self_id = userData._id;
          return sender._id === self_id ? (
            <MessageSelf
              props={{ ...message, content: message.content }}
              key={index}
            />
          ) : (
            <MessageOthers
              props={{ ...message, content: message.content }}
              key={index}
            />
          );
        })}
        <div ref={messagesEndRef} className="BOTTOM" />
      </div>
      <div className="text-input-area">
        <input
          placeholder="Type a Message"
          className="search-box"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyDown={(event) => {
            if (event.code === "Enter") {
              sendMessage();
              setRefresh(!refresh);
            }
          }}
        />
        <IconButton
          className="icon"
          onClick={() => {
            sendMessage();
            setRefresh(!refresh);
          }}
        >
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default ChatArea;
