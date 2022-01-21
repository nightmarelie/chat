const express = require("express");
const app = express();
const server = require("http").Server(app);

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const rooms = {};

app.get("/", (req, res) => {
  res.render("index", { rooms });
});

app.get("/:room", (req, res) => {
  res.render("room", { roomName: req.params.room });
});

server.listen(3000, () => console.log("listen on the port: 3000"));

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const store = {};

io.on("connection", (socket) => {
  socket.on("chat-message", (message) => {
    socket.broadcast.emit("chat-message", {
      message,
      username: store[socket.id],
    });
  });

  socket.on("new-user", (username) => {
    store[socket.id] = username;
    socket.broadcast.emit("user-connected", username);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", store[socket.id]);
    delete store[socket.id];
  });
});
