const io = require("socket.io")(3000, {
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
