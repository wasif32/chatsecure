const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

// Fetch all messages for a specific chat
const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email") // Populate sender's name and email
      .populate("chat"); // Populate the chat details
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(400);
    throw new Error(error.message);
  }
});

// Send a new message
const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  // Validate request data
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.user._id, // Current logged-in user's ID
    content: content,
    chat: chatId,
  };

  try {
    // Create a new message
    let message = await Message.create(newMessage);

    // Populate necessary fields
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email", // Populate users in the chat with name and email
    });

    // Update the latestMessage field in the Chat model
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
