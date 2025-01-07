const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());

// Allow requests from specific origins
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies if needed
  })
);

// Connect to MongoDB
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Server is connected to the database");
  } catch (err) {
    console.error("Server is not connected to the database", err.message);
    process.exit(1); // Exit on failure
  }
};

connectDb();

app.get("/", (req, res) => {
  res.send("API is running");
});

// API Routes
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

// Server Setup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server is running on PORT ${PORT}`)
);

// Socket.io Setup
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  pingTimeout: 60000,
});

let connectedUsers = {}; // Store connected users

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // User Setup
  socket.on("setup", (user) => {
    if (!connectedUsers[user._id]) {
      socket.join(user._id);
      connectedUsers[user._id] = socket.id;
      console.log(`User ${user._id} joined their personal room`);
      socket.emit("connected");
    } else {
      console.log(`User ${user._id} is already connected`);
    }
  });

  // Join a Chat Room
  socket.on("join-chat", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // New Message Handling
  socket.on("newMessage", (newMessageStatus) => {
    const chat = newMessageStatus.chat;

    if (!chat || !chat.users) {
      console.error("Chat or chat.users not defined");
      return;
    }

    chat.users.forEach((user) => {
      // Skip the sender
      if (user._id === newMessageStatus.sender._id) return;

      // Emit to all other users in the chat
      socket.in(user._id).emit("message received", newMessageStatus);
    });
  });

  // Handle Disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    for (let userId in connectedUsers) {
      if (connectedUsers[userId] === socket.id) {
        delete connectedUsers[userId]; // Remove user from the list when disconnected
        console.log(`User ${userId} disconnected`);
      }
    }
  });
});
