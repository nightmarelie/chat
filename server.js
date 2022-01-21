const express = require("express");
const app = express();
const server = require("http").Server(app);

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const rooms = { name: {} };

app.get("/", (req, res) => {
  res.render("index", { rooms });
});

app.post("/room", (req, res) => {
  const room = req.body.room;
  if (rooms[room] != null) {
    return res.redirect("/");
  }
  rooms[room] = { users: {} };
  res.redirect(room);

  io.emit("room-created", room);
});

app.get("/:room", (req, res) => {
  const room = req.params.room;
  if (rooms[room] == null) {
    return res.redirect("/");
  }
  res.render("room", { roomName: room });
});

server.listen(3000, () => console.log("listen on the port: 3000"));

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("chat-message", ({ message, roomName }) => {
    socket.to(roomName).emit("chat-message", {
      message,
      username: rooms[roomName].users[socket.id],
    });
  });

  socket.on("new-user", ({ username, roomName }) => {
    socket.join(roomName);
    rooms[roomName].users[socket.id] = username;
    socket.to(roomName).emit("user-connected", username);
  });

  socket.on("disconnect", () => {
    getUsersRoom(socket).forEach((roomName) => {
      socket.broadcast.emit(
        "user-disconnected",
        rooms[roomName].users[socket.id]
      );
      delete rooms[roomName].users[socket.id];
    });
  });
});

function getUsersRoom(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users && room.users[socket.id] != null) {
      names.push(name);
    }
    return names;
  }, []);
}
