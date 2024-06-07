const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let activeUsers = 0;

io.on("connection", (socket) => {
  if (activeUsers >= 3) {
    socket.emit("deny", "Дождитесь своей очереди");
    socket.disconnect();
    return;
  }

  activeUsers++;
  io.emit("user_count", activeUsers);

  socket.on("disconnect", () => {
    activeUsers--;
    io.emit("user_count", activeUsers);
  });

  socket.on("edit", (data) => {
    socket.broadcast.emit("edit", data);
  });

  socket.on("cursor_move", (data) => {
    socket.broadcast.emit("cursor_move", data);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
