var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mydb' ,function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }}
);

var courseSchema = new mongoose.Schema({
    courseId: {type:String, unique:true},
    courseName: {type:String},
    courseType:String,
    courseDescription:String,

});

var Course= mongoose.model('course',courseSchema);
module.exports = Course;