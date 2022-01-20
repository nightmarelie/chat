const socket = io("http://localhost:3000");

const messageContainerEl = document.getElementById("message-container");
const messageFormEl = document.getElementById("send-container");
const messageInputEl = document.getElementById("message-input");

const username = prompt("What is your name?", "");
appendMessage("You joined");

socket.emit("new-user", username);

socket.on("chat-message", ({ message, username }) => {
  appendMessage(`${username}: ${message}`);
});

socket.on("user-connected", (username) => {
  appendMessage(`User connected: ${username}`);
});

socket.on("user-disconnected", (username) => {
  appendMessage(`User disconected: ${username}`);
});

messageFormEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = messageInputEl.value.trim();

  appendMessage(`You: ${message}`);
  socket.emit("chat-message", message);
  messageInputEl.value = "";
});

function appendMessage(message) {
  const div = document.createElement("div");
  div.innerText = message;

  messageContainerEl.append(div);
}
