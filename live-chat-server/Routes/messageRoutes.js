const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../Controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

const Router = express.Router();

Router.route("/:chatId").get(protect, allMessages);
Router.route("/").post(protect, sendMessage);

module.exports = Router;
