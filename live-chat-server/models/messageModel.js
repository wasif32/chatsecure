const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure sender is always provided
    },
    content: {
      type: String,
      required: true, // Message content is mandatory
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true, // Every message must belong to a chat
    },
    // Optional: Uncomment this if you're implementing direct messages (DMs)
    // reciever: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Message = mongoose.model("Message", messageModel);
module.exports = Message;
