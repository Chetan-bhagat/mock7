const {connection}=require("../db/config");

const mongoose=require('mongoose');


const userRegisterSchema=mongoose.Schema({
    'image':{type:String,required:true},
    'name':{type:String,required:true},
    'email':{type:String,required:true,unique:true},
    'bio':{type:String,required:true},
    'phone':{type:String,required:true},
    'password':{type:String,required:true}
});


const registerModel=mongoose.model('register',userRegisterSchema);

module.exports={registerModel}