const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const PORT = 7000;

const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

app.get("/", (req, res) => {
    res.status(200).json({ name: "server" });
});

const users = {};

io.on("connection", (socket) => {
    console.log("Someone connected and socketId " + socket.id);

    socket.on("disconnect", () => {
        console.log(socket.id + "disconnected");
        for (let user in users) {
            if (users[user] == socket.id) {
                delete users[user];
            }
        }

        io.emit("all_users", users);
    });

    socket.on("new_user", (username) => {
        console.log(username);
        users[username] = socket.id;

        io.emit("new_user", users);
    });

    socket.on("send_message", (data) => {
        console.log(data);

        const socketId = users[data.receiver];
        io.to(socketId).emit("new_message", data);
    });
});

httpServer.listen(PORT, () => {
    console.log(`listening on: ${PORT}`);
    console.log("oki");
});
