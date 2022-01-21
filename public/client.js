const socket = io("http://localhost:3000");

const messageContainerEl = document.getElementById("message-container");
const messageFormEl = document.getElementById("send-container");
const messageInputEl = document.getElementById("message-input");
const roomContainerEl = document.getElementById("room-container");

if (messageFormEl != null) {
  const username = prompt("What is your name?", "");
  appendMessage("You joined");
  socket.emit("new-user", { roomName, username });

  messageFormEl.addEventListener("submit", (e) => {
    e.preventDefault();

    const message = messageInputEl.value.trim();

    appendMessage(`You: ${message}`);
    socket.emit("chat-message", { roomName, message });
    messageInputEl.value = "";
  });
}

socket.on("room-created", (room) => {
  const divEl = document.createElement("div");
  divEl.innerText = room;
  const anchorEl = document.createElement("a");
  anchorEl.href = `/${room}`;
  anchorEl.innerText = "Join";

  roomContainerEl.append(divEl);
  roomContainerEl.append(anchorEl);
});

socket.on("chat-message", ({ message, username }) => {
  appendMessage(`${username}: ${message}`);
});

socket.on("user-connected", (username) => {
  appendMessage(`User connected: ${username}`);
});

socket.on("user-disconnected", (username) => {
  appendMessage(`User disconected: ${username}`);
});

function appendMessage(message) {
  const div = document.createElement("div");
  div.innerText = message;

  messageContainerEl.append(div);
}
