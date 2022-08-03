require('dotenv/config');
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const { ordersModel, usersModel } = require('./Models/models');
const { isAuth } = require('./Utilities/authorization');
const { authorize } = require('./Utilities/middleware.js');
const { createAccessToken, sendAccessToken } = require('./Utilities/tokens.js');
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


app.listen(process.env.PORT || port, () => {
	console.log(`Connect to port at ${port}`);
})

app.post('/register', async(req, res) => {
  console.log(req.body);
  const { email, name, password, state, district, address, pincode, phone } = req.body;
  if (!name || !email || !password || !state || !district || !address || !pincode || !phone) {
    return res.status(400).json({ error: "One or more fields are empty" });
  }
  // const { email, password, phone } = req.body;
  try {
    const emailUser = await usersModel.find({email: email});
    const phoneUser = await usersModel.find({phone: phone})
    if (emailUser.length > 0 || phoneUser > 0) throw new Error("User already Exists");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUsersModel = new usersModel({...req.body, password: hashedPassword});
    await newUsersModel.save();
    res.status(201).json({ result: "Successfully Registered" });
  } catch (error) {
    console.log(error);
    res.send({
      error: `${error.message}`
    })
  }
})

// app.post('/register', async(req, res) => {
//   console.log(req.body);
//   const { email, password, phone } = req.body;
//   try {
//     const emailUser = await usersModel.find({email: email});
//     const phoneUser = await usersModel.find({phone: phone})
//     if (emailUser.length > 0 || phoneUser > 0) throw new Error("User already Exists");
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUsersModel = new usersModel({...req.body, password: hashedPassword});
//     await newUsersModel.save();
//     res.status(200).send("User registered Successfully")
//   } catch (error) {
//     console.log(error);
//     res.send({
//       error: `${err.message}`
//     })
//   }
// })

app.post('/login', async(req, res) => {
  console.log(req.body);
  const { emailormobile, password } = req.body;
  if (!emailormobile || !password) {
    return res.status(400).json({ error: "One or more fields are empty" });
  }
  try {
    const emailUser = await usersModel.find({email: emailormobile});
    console.log(emailUser);
    const phoneUser = await usersModel.find({phone: emailormobile});
    console.log(phoneUser);
    if (emailUser.length === 0 && phoneUser.length === 0) return res.status(400).json({ error: "User doesn't exist" });
    let user;
    if (emailUser.length === 0) {
      user = phoneUser[0];
    } else {
      user = emailUser[0];
    }
    console.log(user);
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Password Incorrect");
    const accessToken = createAccessToken(user.email);
    console.log(accessToken);
    sendAccessToken(res, req, accessToken);
  } catch (err) {
    res.json({
      error: `${err.message}`
    })
  }
})

// app.post('/login', async(req, res) => {
//   console.log(req.body);
//   const { emailorphone, password } = req.body;
//   try {
//     const emailUser = await usersModel.find({email: emailorphone});
//     const phoneUser = await usersModel.find({phone: emailorphone});
//     if (emailUser.length === 0 && phoneUser.length === 0) throw new Error("User doesn't exist");
//     let user;
//     if (emailUser.length === 0) {
//       user = phoneUser[0];
//     } else {
//       user = emailUser[0];
//     }
//     const valid = await bcrypt.compare(password, user.password);
//     if (!valid) throw new Error("Password Incorrect");
//     const accessToken = createAccessToken(user.email);
//     sendAccessToken(res, req, accessToken);
//   } catch (err) {
//     res.json({
//       error: `${err.message}`
//     })
//   }
// })

route.get('/orders', async(req, res) => {
  const userId = isAuth(req);
  const userOrders = await ordersModel.find({userId: userId});
  res.send(userOrders);
})

route.get('/userInfo', async (req, res) => {
  const userId = isAuth(req);
  const [user] = await usersModel.find({email: userId});
  const info = {address: `${user.address + ", " + user.district + ", " + user.state}`, name: user.name}
  res.send(info);
})

route.delete('/orders', async(req, res) => {
  console.log(req.body);
  const userId = isAuth(req);
  let response = await ordersModel.deleteOne({userId: userId, orderId: req.body.orderId});
  console.log(response);
  res.status(200).send(response);
})


route.post('/newOrder', async(req, res) => {
  let { timeStamp, storeInfo, status, items} = req.body; 
  const userId = isAuth(req);
  console.log(userId);
  const orderInfo = await ordersModel.find({userId: userId});
  let orderId = "OR" + String(orderInfo.length + 1).padStart(5, '0');
  const userAddress = "any address";
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
    console.log(err);
    res.status(400).send(err.message);
  }
})

app.get('/allorders', async (req, res) => {
  const allOrders = await ordersModel.find();
  res.send(allOrders);
})

app.get("/allusers", async (req, res) => {
  const allUsers = await usersModel.find();
  res.send(allUsers);
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

// {
//     "userId": "Suraj",
//     "orderId": "OR00001",
//     "timeStamp": "11 OCT 2022, 10:30 am",
//     "storeInfo": {
//         "address": "JP nagar",
//         "city": "Bangaluru",
//         "phone": "+91 9876543210"
//     },
//     "userAddress": "West Bengal",
//     "status": "In washing",
//     "items": [
//         {
//             "shirt": {
//                 "quantity": 10,
//                 "wash-type": [1, 0, 0, 1]
//             }
//         },
//         {
//             "trousers": {
//                 "quantity": 3,
//                 "washType": [1, 0, 0, 0]
//             }
//         }
//     ]
// }