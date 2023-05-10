const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

const mongoURI = "mongodb://localhost:27017/wedding";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB database.");
});

const guestSchema = new mongoose.Schema({
  name: String,
  isAttending: Boolean,
});

const messageSchema = new mongoose.Schema({
  name: String,
  message: String,
});

const Guest = mongoose.model("Guest", guestSchema);
const Message = mongoose.model("Message", messageSchema);

app.use(bodyParser.json());

app.post("/api/guests", async (req, res) => {
  const { name } = req.body;

  const guest = new Guest({
    name,
  });

  try {
    await guest.save();
    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to save guest",
    });
  }
});

app.post("/api/messages", async (req, res) => {
  const { name, message } = req.body;

  const messageObj = new Message({
    name,
    message,
  });

  try {
    await messageObj.save();
    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to save message",
    });
  }
});

app.get("/api/guests", async (req, res) => {
  try {
    const guests = await Guest.find({});
    res.json(guests);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to get guests",
    });
  }
});

app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find({});
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to get messages",
    });
  }
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
