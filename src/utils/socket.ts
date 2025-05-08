import { io } from "socket.io-client";

// Kết nối đến socket server
const socket = io("*"); // Thay "localhost:8080" bằng URL server của bạn nếu cần

// Sự kiện khi kết nối thành công
socket.on("connect", () => {
  console.log("Connected to socket server:", socket.id);
});

// Sự kiện khi ngắt kết nối
socket.on("disconnect", () => {
  console.log("Disconnected from socket server");
});

// Bạn có thể export socket để sử dụng ở các nơi khác trong frontend
export default socket;
