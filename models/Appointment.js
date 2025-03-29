const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const AppointmentSchema = new Schema({
  date: String,
  time: String,
  isTimeSlotAvailable: Boolean,
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
