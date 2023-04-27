const mongoose=require('mongoose');

const connection=mongoose.connect("mongodb+srv://chetanbhagat:chetan@cluster0.lkj8w.mongodb.net/mock7?retryWrites=true&w=majority");

module.exports={connection}