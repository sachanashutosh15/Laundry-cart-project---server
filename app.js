const express = require("express");
const mongoose = require("mongoose");
const { ordersModel, usersModel } = require('./Models/models');
const app = express();

const port = 3001;

mongoose.connect("mongodb+srv://Sandip12:sandip12@instaclone.d7yn26d.mongodb.net/LaundryCart?retryWrites=true&w=majority", () => {
	console.log("connect to db");
}, (err) => { console.log(err) });

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", async (req, res) => {
	const data = await Orders.find();
	res.send(data);
});

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

app.listen(port, () => {
	console.log(`Connect to port at ${port}`);
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