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
io.on("connection", (socket) => {
  // Отправляем текущие результаты новому подключенному клиенту
  socket.emit("updateVotes", votes);

  // Обрабатываем голосование
  socket.on("vote", (vote) => {
    if (vote.option === "option1") {
      votes.option1++;
    } else if (vote.option === "option2") {
      votes.option2++;
    }

    // Рассылаем обновленные результаты всем подключенным клиентам
    io.emit("updateVotes", votes);
  });
});

server.listen(8080, () => {
  console.log(`Server started on port ${PORT}`);
});
