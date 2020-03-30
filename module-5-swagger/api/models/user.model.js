var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  login: String,
  password: String,
  age: Number,
  isDeleted: { type: Boolean, default: false }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
