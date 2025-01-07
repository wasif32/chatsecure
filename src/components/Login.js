import React from "react";
import logo from "../live-chat_512px.png";
import { Backdrop, CircularProgress, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Toaster from "./Toaster";

function Login() {
  const [data, setData] = useState({ name: "", password: "" });
  const [loading, setLoading] = useState(false);

  const [logInStatus, setLogInStatus] = React.useState("");

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const loginHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.post(
        "http://localhost:5000/user/login",
        data,
        config
      );
      setLogInStatus("Login Successful!");
      sessionStorage.setItem("userData", JSON.stringify(response.data));
      console.log(response.data);
      navigate("/app/welcome");
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response.status == 400) {
        setLogInStatus({
          msg: "All necessary input fields are not filled",
          key: Math.random(),
        });
      } else if (error.response) {
        setLogInStatus({
          msg: "Invalid Username or Password",
          key: Math.random(),
        });
      } else {
        setLogInStatus({
          msg: "Network error or server not reachable. Please try again.",
          key: Math.random(),
        });
      }
    } finally {
      setLoading(false);
    }
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
          <p className="login-text">Login to your Account</p>
          <TextField
            onChange={changeHandler}
            id="standard-basic"
            label="Enter User Name"
            variant="outlined"
            color="secondary"
            name="name"
            onKeyDown={(event) => {
              if (event.code == "Enter") {
                loginHandler();
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
                loginHandler();
              }
            }}
          />
          <Button
            variant="outlined"
            color="secondary"
            onClick={loginHandler}
            isLoading
          >
            Login
          </Button>
          {logInStatus ? (
            <Toaster key={logInStatus.key} message={logInStatus.msg} />
          ) : null}

          <div style={{ display: "flex" }}>
            <p style={{ margin: 0, marginRight: "2px" }}>
              Don't have an account?
            </p>
            <Button
              variant="text"
              color="primary"
              style={{
                textTransform: "none",
                padding: "0",
                minWidth: "auto",
                textDecoration: "underline",
              }}
              href="/"
            >
              SignUp
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
