const mongoose = require("mongoose");

// Chat Schema
const chatModel = mongoose.Schema(
  {
    chatName: { type: String, required: true }, // Ensure chatName is provided
    isGroupChat: { type: Boolean, default: false }, // Default is a direct chat
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;
