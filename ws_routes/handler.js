const jwt = require("jsonwebtoken");
const db = require("../services/mongodb.js");
const { ObjectId } = require("mongodb");
const { ErrSender, authUser, ExpectedError } = require("./common.js");
const studentHandler = require("./studentHandler.js");
const staffHandler = require("./staffHandler.js");
module.exports = function (io) {
  // Socket.IO connection event
  io.on("connection", (socket) => {
    const authenticated = authUser(socket);
    if (!authenticated) {
      socket.disconnect(true);
      return;
    }

    socket.safeOn = function (eventName, eventHandler) {
      const wrappedHandler = async function (...args) {
        try {
          await eventHandler(...args);
        } catch (error) {
          console.log("Error:", error);

          if (error instanceof ExpectedError)
            socket.emit("error", { msg: error.message });
          else socket.emit("error", { msg: "خطای غیرمنتظره از سرور" });
        }
      };
      socket.on(eventName, wrappedHandler);
    };

    const { isStaff } = socket.handshake.user;

    if (!isStaff) studentHandler(io, socket);
    else {
      staffHandler(io, socket);
    }
  });
};
