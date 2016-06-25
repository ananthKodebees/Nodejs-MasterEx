var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../lib/User');
var Course = require('../lib/Course');
var Schema = mongoose.Schema

var url = 'mongodb://127.0.0.1:27017/mydb'
router.get('/',function (req,res, next){

  res.render('index',{title:'Express'});

});

router.post('/login', function (req,res) {
  var username = req.body.username;
  var password = req.body.password;
  var gcmId = req.body.gcmId;

  console.log(username,gcmId,password);


User.findOne({username:username , password:password} ,function (err, user) {
  console.log(user);

  if(user){

    User.update({_id:user._id},{$push:{gcmId:gcmId}},function (err, save) {

    })
    var loginResponse = {status:true, "id":user._id ,"message":"logged in successfully"};

    return res.status(200).send(loginResponse);
  }

{
    var loginResponse = {status:false,"message":"login failed"};
    return res.status(200).send(loginResponse);
  }

})


});
router.get('/dashboard', function (req, res) {
  if(!req.session.user){
    return res.status(401).send("please login to Access dashboard");
  }
  return res.status(200).send("welcome to my first api ");

});

router.get('/logout',function (req, res) {
  req.session.destroy();
  return res.status(200).send();
});

router.post('/register', function(req,res){

  var username = req.body.username;
  var password = req.body.password;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;

  console.log(username,password,firstname,lastname);
  var newuser = new User();
  newuser.username = username;
  newuser.password = password;
  newuser.firstname = firstname;
  newuser.lastname = lastname;
  newuser.save(function(err,savedUser){
    console.log(savedUser);
    if(savedUser){
      var registerResponse = {status:true,"id":savedUser._id, "message":"registration successfull"};
      return res.status(200).send(registerResponse);


    }

    var registerResponse = {status:false, "message":"registration failed"};
    console.log(err);
    return res.status(200).send(registerResponse)

  })
})

router.post('/course', function(req,res){

  var courseId = req.body.courseId;
  var courseName = req.body.courseName;
  var courseType = req.body.courseType;
  var courseDescription = req.body.courseDescription;

  console.log(courseId,courseName,courseType,courseDescription);

  var newcourse = new Course();
  newcourse.courseId = courseId;
  newcourse.courseName = courseName;
  newcourse.courseType = courseType;
  newcourse.courseDescription = courseDescription;
  newcourse.save(function(err,savedCourse){
    console.log(savedCourse);
    if(savedCourse){
      var registerCourse = {status:true, "message":"course registration successful"};
      return res.status(200).send(registerCourse);

    }
    var registerCourse = {status:false, "message":" course registration failed"};
    console.log(err);
    return res.status(200).send(registerCourse);

  })
})

router.get('/courselist' , function(req,res){
Course.find({}, function (err, courseList){
  
  if(err){
    console.log(err)
  }
  else{
    var displayCourse = {"courselist":courseList}
    return res.status(200).send(displayCourse);
  }
})
})
router.post('/profile', function (req,res) {
  var _id = req.body._id;

  console.log(_id);

  User.findOne({_id:_id }, function (err, user) {
    console.log(user);

    if(user){
      var loginResponse = {status:true,"profile":user  };

      return res.status(200).send(loginResponse);
    }
    else{
      var loginResponse = {status:false, "message":"Error"};
      return res.status(200).send(loginResponse);
    }

  })

});

 router.post('/saveCourse', function(req,res){

  var userid = req.body.userid;
  var courseid = req.body.courseid ;
  console.log(userid,courseid);

User.update({_id:userid},{$push:{savedCourse:courseid}},function(err,save){

  if(err){
    var saveResponse = {status:false, "message":"Error.please try again"};
    console.log(err);
    return res.status(200).send(saveResponse)
  }
  else {
    var saveResponse = {status:true, "message":"success"};
    return res.status(200).send(saveResponse)
  }
})
})

router.post('/savedCourseList', function (req,res) {
  var _id = req.body._id;
  var id = mongoose.Types.ObjectId(_id);
  console.log(id);

  User.aggregate([

    { $match : { _id : id } },
    { $unwind: "$savedCourse" },
    { $lookup: {
      from: "courses",
      localField: "savedCourse",
      foreignField: "_id",
      as: "courseList"
    }},

    { $unwind:"$courseList"  },

    { $group: {
      "_id":"$_id" ,
      "courseList": { $push: "$courseList" }
    }}
  ],function (err, list) {

    if (err) {
      var savedResponse = {status: false, "message": "Error.please try again"};
      console.log(err);
      return res.status(200).send(savedResponse)
    }
    else {
      var savedResponse = { "courselist": list};
      return res.status(200).send(savedResponse)
    }
  })
})

router.post('/updateProfile', function (req,res) {

  var username = req.body.username;
  var password = req.body.password;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;

  var _id = req.body._id;

  User.update({_id:_id},{$set:{'password':password,'lastname':lastname,'firstname':firstname}},function (err,update) {

    if(err) {

      var updateResponse = {status: false, "message": "Error .please try again"};
      console.log(err);
      return res.status(200).send(updateResponse)
    }
    else {
console.log(update)
        var updateResponse = {status:true, "message":"success"};
        return res.status(200).send(updateResponse)
      }
  })
})

//

module.exports = router;
