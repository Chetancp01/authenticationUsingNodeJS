const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mongouser:chetan@123@mongodbnode.bhdcc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{useNewUrlParser : true, useFindAndModify : true, useCreateIndex : true, useUnifiedTopology : true})
.then(() => console.log("conection successfull..."))
.catch((err) => console.log(err));