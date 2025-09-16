const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { sequelize } = require("./models");

const chatRoutes = require("./routes/chat");
const authRoutes = require("./routes/auth");
const initSockets = require("./socket");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);


const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });
initSockets(io);

sequelize.sync().then(() => console.log("✅ DB Synced"));

server.listen(5000, () => console.log("🚀 Server running on 5000"));
