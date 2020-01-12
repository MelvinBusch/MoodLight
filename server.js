// Setup
const express = require("express");
const app = express();
const server = app.listen(process.env.PORT || 3000, listen);
let host;
let port;

function listen() {
  host = server.address().address;
  port = server.address().port;
  console.log('Sever startet at: http://' + host + ':' + port);
}

app.use(express.static('public'));

let io = require("socket.io")(server);

// Johnny Five Stuff
const five = require("johnny-five");
const board = new five.Board();

board.on("ready", () => {
  console.log("Board is ready!");

  let lights = new five.Led.RGB({
    pins: [3, 5, 6],
    isAnode: true
  });
  lights.color("#ffffff");

  const poti = new five.Sensor({
    pin: "A0",
    threshold: 5
  });

  const touch = new five.Sensor({
    pin: "A1",
    threshold: 100,
  });
  touch.booleanAt(100);

  io.sockets.on("connection", (socket) => {

    // Trigger Touch Event
    touch.on("change", () => socket.emit("touch", touch.boolean));

    // Trigger Heart Rate
    poti.on("change", () => socket.emit("heartrate", poti.value))

    // Trigger Color Change
    socket.on("changeColor", (_color) => {
      lights.color(_color);
    });

    // Handle Disconnection
    socket.on("disconnect", () => {
      console.log("Client: " + socket.id + " disconnected");
    });
  });
});