var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mydb' ,function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }}
);

var userSchema = new mongoose.Schema({
    username: {type:String, unique:true},
    password: {type:String},
    firstname:String,
    lastname:String
});

var User= mongoose.model('mongo',userSchema) ;
module.exports = User;