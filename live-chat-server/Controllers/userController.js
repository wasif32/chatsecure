const express = require("express");
const UserModel = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("./config/generateToken");

const loginController = expressAsyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const user = await UserModel.findOne({ name });

  if (user && (await user.matchPassword(password))) {
    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    };

    res.json(response);
  } else {
    //check for all fields
    if (!name || !email || !password) {
      res.status(400);
      throw Error("All necessary input fields are not filled");
    }
  }
});

//Registration
const registerController = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //check for all fields
  if (!name || !email || !password) {
    res.status(400);
    throw Error("All necessary input fields are not filled");
  }

  //pre-existing user
  const userExist = await UserModel.findOne({ email });
  if (userExist) {
    res.status(405);
    throw new Error("User with this email-id already Exists");
  }

  //username already taken
  const userNameExist = await UserModel.findOne({ name });
  if (userNameExist) {
    res.status(406);
    throw new Error("Username already taken");
  }

  //create an entry in the db
  const user = await UserModel.create({ name, email, password });

  //Response
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400); // Set proper status code
    throw new Error("Failed to create user");
  }
});

const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await UserModel.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  res.send(users);
});

module.exports = {
  loginController,
  registerController,
  fetchAllUsersController,
};
