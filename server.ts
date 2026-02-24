import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import { Server } from "socket.io";
import http from "http";
import Message from "./server/models/Message.ts";
import authRoutes from "./server/routes/auth.ts";
import userRoutes from "./server/routes/userRoutes.ts";
import matchRoutes from "./server/routes/matchRoutes.ts";
import chatRoutes from "./server/routes/chatRoutes.ts";

dotenv.config();

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  const PORT = 3000;

  // Socket.io logic
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join_room", (matchId) => {
      socket.join(matchId);
      console.log(`User joined room: ${matchId}`);
    });

    socket.on("send_message", async (data) => {
      const { matchId, senderId, text } = data;
      try {
        const newMessage = new Message({
          matchId,
          sender: senderId,
          text
        });
        await newMessage.save();
        io.to(matchId).emit("receive_message", newMessage);
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  // Connect to MongoDB
  const mongodbUri = process.env.MONGODB_URI;
  if (mongodbUri) {
    mongoose
      .connect(mongodbUri)
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error("MongoDB connection error:", err));
  } else {
    console.warn("MONGODB_URI not found in environment variables. Database features will be disabled.");
  }

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Study Buddy API is running" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/matches", matchRoutes);
  app.use("/api/chat", chatRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
