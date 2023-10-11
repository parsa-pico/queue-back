const express = require("express");
const cors = require("cors");
const error = require("../middlewares/error");
const admin = require("../routes/admin.js");
const student = require("../routes/student.js");
const socketIo = require("socket.io");
const wsHandler = require("../ws_routes/handler.js");
const https = require("https");
const http = require("http");
const fs = require("fs");
module.exports = function (app) {
  app.use(cors());
  // const server = https.createServer(
  //   {
  //     key: fs.readFileSync(
  //       "J:/MY-PROJECTS/My node projects/queue/localhost-key.pem"
  //     ),
  //     cert: fs.readFileSync(
  //       "J:/MY-PROJECTS/My node projects/queue/localhost.pem"
  //     ),
  //   },
  //   app
  // );
  const server = http.createServer(app);
  const io = socketIo(server, { cors: { credentials: true } });
  wsHandler(io);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/admin", admin);
  app.use("/student", student);
  app.use(error);
  return server;
};
