const router = require("express").Router();
const Message = require('../models/Message')
const User = require("../models/User");

const activeConnections = {};

router.ws("/", async (ws, res) => {
  const to = res.query.to;
  const id = res.query.id
  activeConnections[id] = ws;

  ws.on("message", async msg => {
    const decodedMessage = JSON.parse(msg);
    switch (decodedMessage.type) {
      case "GET_ALL_MESSAGES":
        const result = await Message.find({
          $or: [{$and: [{from: id}, {to: to}]}, {$and: [{from: to}, {to: id}]}]
        }).sort({datetime: 1});

        if (result) {
          ws.send(JSON.stringify({type: "ALL_MESSAGES", result}));
        } else {
          ws.send(JSON.stringify({type: "ERROR"}));
        }
        break;
      case "CREATE_MESSAGE":
        let messageData = {};
        messageData.text = decodedMessage.text;
        messageData.from = decodedMessage.from;
        messageData.to = decodedMessage.to;
        messageData.dateTime = new Date();
        const newMessage = new Message(messageData);
        console.log(newMessage);
        try {
          await newMessage.save();
        } catch (e) {
          console.log(e);
        }
        activeConnections[id].send(JSON.stringify({
          type: "NEW_MESSAGE",
          message: newMessage
        }));

        if (activeConnections[to]) {
          activeConnections[to].send(JSON.stringify({
            type: "NEW_MESSAGE",
            message: newMessage,
          }));
        }
        break;
      case "CREATE_MESSAGE_WITH_IMAGE":
        const msgImg = await Message.findOne({text: decodedMessage.text});
        activeConnections[id].send(JSON.stringify({
          type: "NEW_MESSAGE",
          message: msgImg
        }));

        if (activeConnections[to]) {
          activeConnections[to].send(JSON.stringify({
            type: "NEW_MESSAGE",
            message: msgImg,
          }));
        }
        break;
      case "START_TYPING":
        if (activeConnections[to]) {
          activeConnections[to].send(JSON.stringify({
            type: "START_TYPING",
          }));
        }
        break;
      case "STOP_TYPING":
        if (activeConnections[to]) {
          activeConnections[to].send(JSON.stringify({
            type: "STOP_TYPING",
          }));
        }
        break;
      default:
        console.log("Unknown message type:", decodedMessage.type);
    }
  });
  ws.on("close", msg => {
    delete activeConnections[id];
  });
});

module.exports = router;