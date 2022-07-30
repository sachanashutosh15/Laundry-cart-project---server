require('dotenv/config');
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { ordersModel, usersModel } = require('./Models/models');
const { isAuth } = require('./Utilities/authorization');
const { authorize } = require('./Utilities/middleware.js');
const app = express();
const route = express.Router();
const {MobileOrEmail} =require("./components/MobileOrEmail.js");

const port = 3001;


mongoose.connect("mongodb+srv://Sandip12:sandip12@instaclone.d7yn26d.mongodb.net/LaundryCart?retryWrites=true&w=majority", () => {
  console.log("Successfully connected to LaundryCart Database");
}, (err) => { console.log(err) });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
route.use(authorize);

MobileOrEmail();
app.listen(port, () => {
  console.log(`Connect to port at ${port}`);
})


app.post('/register', (req, res) => {
  // Suraj's field
  console.log(req.body);
  const { email, name, password, state, district, address, pincode, phone } = req.body;
  if (!name || !email || !password || !state || !district || !address || !pincode || !phone) {
    return res.status(400).json({ error: "one or more fields are empty" });
  }
  usersModel.findOne({ email: email })
    .then((dbUser) => {
      if (dbUser) {
        return res.status(500).json({ error: "invalid credentials" });
      }
      bcrypt.hash(password, 16)
        .then((hashPassword) => {
          const newUser = new usersModel({
            name,
            email,
            state,
            district,
            address,
            pincode,
            phone,
            password: hashPassword
          })
          console.log("registered-->" + newUser);
          newUser.save()
            .then((user) => {
              res.status(201).json({ result: "successfully registered", user: user });
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
})


app.post('/login', (req, res) => {
  // Suraj's field

  const { emailormobile, password, check } = req.body;
  console.log(emailormobile);
  console.log("check-->" + check);
  if (!emailormobile || !password) {
    return res.status(400).json({ error: "one or more fields are empty" });
  }
  
  if (check === "0") {
    usersModel.findOne({ phone: emailormobile })
      .then((dbUser) => {
        if (!dbUser) {
          return res.status(400).json({ error: `invalid credentials ${test}` });
        }
        bcrypt.compare(password, dbUser.password)
          .then((didMatch) => {
            if (!didMatch) {
              return res.status(400).json({ error: "invalid credentials (password)" });
            }
            // return res.status(200).json({error:"Logged in successfully"});
            const jwtToken = jwt.sign({ _id: dbUser._id }, process.env.SECRET_KEY);
            const { _id, name, email } = dbUser;
            res.status(200).json({ result: "Logged in successfully", token: jwtToken, userInfo: { _id, name, email } });
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }
  else {
    usersModel.findOne({ email: emailormobile })
      .then((dbUser) => {
        if (!dbUser) {
          return res.status(400).json({ error: `invalid credentials ${test}` });
        }
        bcrypt.compare(password, dbUser.password)
          .then((didMatch) => {
            if (!didMatch) {
              return res.status(400).json({ error: "invalid credentials (password)" });
            }
            // return res.status(200).json({error:"Logged in successfully"});
            const jwtToken = jwt.sign({ _id: dbUser._id }, process.env.SECRET_KEY);
            const { _id, name, email } = dbUser;
            res.status(200).json({ result: "Logged in successfully", token: jwtToken, userInfo: { _id, name, email } });
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }
})


app.get('/orders', async (req, res) => {
  // Sandip's field
  // const userId=isAuth(req);
  // console.log(userId);
  const data = await ordersModel.find();
  // console.log(data);
  res.send(data);
})


route.delete('/orders', async (req, res) => {
  // Sandip's field
})


app.post('/orders', async (req, res) => {
  const { orderId, timeStamp, storeInfo, userAddress, status, items } = req.body;
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




// suraj--->do not delete it
// usersModel.findOne({ email: emailormobile })
// .then((dbUser) => {
//   if (!dbUser) {
//     usersModel.findOne({phone:emailormobile})
//       .then((dbUser)=>{
//         if(!dbUser){
//           return res.status(400).json({ error: "invalid credentials (email/mobile)" });
//         }
//       })
//       .catch((error)=>console.log(error));
//   }