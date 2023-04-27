const express=require("express");

const app=express();

const cors=require("cors");

const { connection } = require("./db/config");

const {userRouter}=require("./Routes/user.route")


// ****MIDDLEWARES***
app.use(cors({origin:true}));
app.use(express.json());

// ******ROUTES*****
app.get("/",(req,res)=>{
    res.send("welcome")
})
app.use('/',userRouter);


// ******SERVER*****
app.listen(9168,async()=>{
    try{
        await connection
        console.log("Connected to db🎉")
    }catch(err){
        console.log("error",err)
    }
    console.log("Server is running")
})