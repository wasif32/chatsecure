import React, { useState } from "react";
import DoneOutlineRoundedIcon from "@mui/icons-material/DoneOutlineRounded";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";

function CreateGroups() {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const nav = useNavigate();
  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }
  const user = userData;
  const [groupName, setGroupName] = useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createGroup = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios.post(
      "http://localhost:5000/chat/createGroup",
      {
        name: groupName,
        users: JSON.stringify([user._id]), // Add only the current user as the group member
      },
      config
    );
    nav("/app/groups");
  };

  return (
    <>
      <div>
        <Dialog
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Do you want to create a Group Named " + groupName}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This will create a group in which you will be the admin.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button
              onClick={() => {
                createGroup();
                handleClose();
              }}
              autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div className="createGroups-container">
        <input
          placeholder="Enter Group Name"
          className="search-box"
          onChange={(e) => {
            setGroupName(e.target.value);
          }}
        />
        <IconButton
          className="icon"
          onClick={() => {
            handleClickOpen();
          }}
        >
          <DoneOutlineRoundedIcon />
        </IconButton>
      </div>
    </>
  );
}

export default CreateGroups;
