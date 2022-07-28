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
})

const ordersModel = mongoose.model('orders', orderSchema);
const usersModel = mongoose.model('users', userSchema);

module.exports = { ordersModel, usersModel };