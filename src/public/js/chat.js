const socket = io();
let user;

const chatbox = document.getElementById("chatbox");
const messageLogs = document.getElementById("messageLogs");

 Swal.fire({
  title: 'Login with email',
  input: 'email',
  inputPlaceholder: 'Enter your email address',
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  socket.emit("authenticatedUser", user);
});


chatbox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    socket.emit("message", { user: user, message: chatbox.value });
    chatbox.value == "";
  }
});

socket.on("imprimir", (msj) => {
  const mensaje = `<b>${msj.user} escribio:</b> ${msj.message} <br/>`;
  messageLogs.innerHTML += mensaje;
});

socket.on("messages", (data) => {
  let mensajes = "";
  data.forEach((msj) => {

    mensajes += `<b>${msj.user} escribio:</b> ${msj.message} <br/>`;
  });
  messageLogs.innerHTML = mensajes;
});

socket.on('newUserAlert', (data)=>{
  if (!user) return
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    title:  data + ' se ha unido al chat',
    icon: 'success'
  })

})