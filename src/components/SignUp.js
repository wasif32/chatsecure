import React, { useState } from "react";
import logo from "../live-chat_512px.png";
import { Button, TextField, Backdrop, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toaster from "./Toaster";

function Signup() {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [signInStatus, setSignInStatus] = React.useState("");

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const signUpHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.post(
        "http://localhost:5000/user/register",
        data,
        config
      );
      console.log(response);
      setSignInStatus("Registration Successfull");
      sessionStorage.setItem("userData", JSON.stringify(response.data));
      navigate("/app/welcome");
    } catch (error) {
      console.error("Error during signup:", error);
      if (error.response) {
        // If the response exists, handle specific status codes
        if (error.response.status === 405) {
          setSignInStatus({
            msg: "User with this email ID already exists",
            key: Math.random(),
          });
        } else if (error.response.status === 406) {
          setSignInStatus({
            msg: "Username already taken, please choose another one",
            key: Math.random(),
          });
        } else if (error.response.status === 400) {
          setSignInStatus({
            msg: "All necessary input fields are not filled",
            key: Math.random(),
          });
        } else {
          setSignInStatus({
            msg: `Unexpected Error: ${error.response.status}`,
            key: Math.random(),
          });
        }
      } else {
        // Fallback for errors without a response (e.g., network errors)
        setSignInStatus({
          msg: "Network error or server not reachable. Please try again.",
          key: Math.random(),
        });
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <div className="login-container">
        <div className="image-container">
          <img src={logo} alt="Logo" className="welcome-logo" />
        </div>
        <div className="login-box">
          <p className="login-text">Create your Account</p>
          <TextField
            onChange={changeHandler}
            id="standard-basic"
            label="Enter User Name"
            variant="outlined"
            color="secondary"
            name="name"
            helperText=""
            onKeyDown={(event) => {
              if (event.code == "Enter") {
                signUpHandler();
              }
            }}
          />
          <TextField
            onChange={changeHandler}
            id="standard-basic"
            label="Enter Email Address"
            variant="outlined"
            color="secondary"
            name="email"
            onKeyDown={(event) => {
              if (event.code == "Enter") {
                // console.log(event);
                signUpHandler();
              }
            }}
          />
          <TextField
            onChange={changeHandler}
            id="outlined-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            color="secondary"
            name="password"
            onKeyDown={(event) => {
              if (event.code == "Enter") {
                // console.log(event);
                signUpHandler();
              }
            }}
          />
          <Button variant="outlined" onClick={signUpHandler}>
            SignUp
          </Button>
          {signInStatus ? (
            <Toaster key={signInStatus.key} message={signInStatus.msg} />
          ) : null}
          <div style={{ display: "flex" }}>
            <p style={{ margin: 0, marginRight: "2px" }}>
              Already have an account?
            </p>
            <Button
              variant="text"
              color="primary"
              style={{
                textTransform: "none",
                padding: "0",
                minWidth: "auto",
                textDecoration: "underline",
                className: "hyper",
              }}
              href="/login"
            >
              Log in
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
