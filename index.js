const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // или укажите конкретный origin, если требуется
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 3000;

let users = [];
let documentContent = "";

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (username) => {
    if (users.length < 3) {
      users.push({ id: socket.id, username });
      io.to(socket.id).emit("allowEdit", true);
      io.emit("updateUsers", users);
      io.to(socket.id).emit("document", documentContent);
    } else {
      io.to(socket.id).emit("allowEdit", false);
      io.to(socket.id).emit("message", "Дождитесь своей очереди");
    }
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.id !== socket.id);
    io.emit("updateUsers", users);
  });

  socket.on("edit", (content) => {
    documentContent = content;
    socket.broadcast.emit("document", documentContent);
  });

  socket.on("cursorMove", (cursorData) => {
    socket.broadcast.emit("cursorMove", cursorData);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
