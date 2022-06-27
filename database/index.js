const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: String,
  pass: String,
  result: String,
});

const Users = mongoose.model("Users", UserSchema);

module.exports = {
  Users,
};
