require('dotenv/config');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { ordersModel, usersModel } = require('./Models/models');
const { isAuth } = require('./Utilities/authorization');
const { authorize } = require('./Utilities/middleware.js');
const app = express();
const route = express.Router();

const port = 3001;


mongoose.connect("mongodb+srv://Sandip12:sandip12@instaclone.d7yn26d.mongodb.net/LaundryCart?retryWrites=true&w=majority", () => {
	console.log("Successfully connected to LaundryCart Database");
}, (err) => { console.log(err) });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
route.use(authorize);


app.listen(port, () => {
	console.log(`Connect to port at ${port}`);
})


app.post('/register', async(req, res) => {
  // Suraj's field
})


app.post('/login', async(req, res) => {
  // Suraj's field
})


app.get('/orders', async(req, res) => {
  // Sandip's
  const data = await ordersModel.find({userId:"ashutosh15"});
  if(data.length === 0){
    // app.render(createorder.js)
    console.log("user do's not have a data")
  }
  else{
    console.log(data);
    res.send(data);
  }  

});


route.delete('/orders', async(req, res) => {
  // Sandip's field
})


app.post('/orders', async(req, res) => {
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
    console.log(result);
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
})


// secretRoute.post('/updateOrder', async(req, res) => {
// // search the order which has userId == req.body.useId and orderId === req.body.orderId
// // then update its status
//   const order = await orders.updateOne(
//     {
//       userId: req.body.userId,
//       orderId: req.body.orderId,
//     },
//     {
//       $set: {
//         status: updatedStatus,
//       }
//     }
//   )
// })


app.use('/', route);