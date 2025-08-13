const mongoose = require("mongoose");
const replySchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Anonymous",
  },
  text: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const commentSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "Anonymous",
  },
  text: {
    type: String,
    required: true,
  },
  replies: [replySchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
