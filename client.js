const socket = io("http://localhost:3000");

const messageContainerEl = document.getElementById("message-container");

socket.on("chat-message", (data) => {
  const div = document.createElement("div");
  div.innerText = data;

  messageContainerEl.append(div);
});
