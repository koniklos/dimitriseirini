const mongoose = require("mongoose");

const RsvpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

const Rsvp = mongoose.model("Rsvp", RsvpSchema);

module.exports = Rsvp;
