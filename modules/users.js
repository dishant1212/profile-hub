const mongoose = require('mongoose');

const userShema = new mongoose.Schema({
  userId: {
    type: Number,
  },
  userName: {
    type: String,
    require: true,
  },
  emailId: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  profileImg: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
});

const Users = mongoose.model('user', userShema);

module.exports = Users;
