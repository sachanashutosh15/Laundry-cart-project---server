const app = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const { ordersModel, usersModel } = require("./src/models");

mongoose.connect("")

route.post('/order', async(req, res) => {
  const { orderId, timeStamp, storeInfo, userAddress, status, items} = req.body; 
  const userId = isAuth(req);
  try {
    const newOrders = new ordersModel({
      userId,
      orderId,
      timeStamp,
      storeInfo,
      userAddress,
      status,
      items,     
    })
    const result = await newOrders.save();
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
})

secretRoute.patch('/updateOrder', async(req, res) => {
// search the order which has userId == req.body.useId and orderId === req.body.orderId
// then update its status
  const order = await orders.updateOne(
    {
      userId: req.body.userId,
      orderId: req.body.orderId,
    },
    {
      $set: {
        status: updatedStatus,
      }
    }
  )
})