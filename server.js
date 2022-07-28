const express = require("express");
const mongoose = require("mongoose");
const Orders= require('./Schema/order');
const app = express();

const port = 3001;

mongoose.connect("mongodb+srv://Sandip12:sandip12@instaclone.d7yn26d.mongodb.net/LaundryCart?retryWrites=true&w=majority",()=>{
    console.log("connect to db");
},(err)=>{console.log(err)});
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.get("/",async(req,res)=>{
    const data = await Orders.find();
    res.send(data);
});


app.post("/post",(req,res)=>{
    
            const newOreder=new Orders({
                order_id:req.body.order_id,
                timestamp:req.body.order_date,
                store_loaction: req.body.store_loaction,
                city:req.body.city,
                store_phone:req.body.store_phone,
                total_item:req.body.total_item,
                price:req.body.price,
                status:req.body.status,
            })
            console.log(newOreder);
            newOreder.save().then(()=>{
                res.send("success");
            }).catch((err)=>{
                console.log(err)
            })
        })
app.listen(port,()=>{
    console.log(`Connect to port at ${port}`);
})