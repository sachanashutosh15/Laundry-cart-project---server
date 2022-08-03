const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: String,
    required: true,
  },
  storeInfo: {
    type: String,
    required: true,
  },
  userAddress: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  items: {
    type: String,
    required: true,
  }
});

const userSchema = new mongoose.Schema({
  // Suraj's field
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pincode:{
    type: String,
    required: true
  }
})

const ordersModel = mongoose.model('orders', orderSchema);
const usersModel = mongoose.model('users', userSchema);

module.exports = { ordersModel, usersModel };