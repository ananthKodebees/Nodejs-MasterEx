var express = require('express');
var router = express.Router();
var User = require('../lib/User');
var Course = require('../lib/Course');

var url = 'mongodb://127.0.0.1:27017/mydb'
router.get('/',function (req,res, next){

  res.render('index',{title:'Express'});

});

router.post('/login', function (req,res) {
  var username = req.body.username;
  var password = req.body.password;
  console.log(username,password);

User.findOne({username:username , password:password}, function (err, user) {
  console.log(user);

  if(user){
    var loginResponse = {status:true, "id":user._id ,"message":"logged in successfully"};

    return res.status(200).send(loginResponse);
  }
else{
    var loginResponse = {status:false, "message":"login failed"};
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
    ;

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
      var registerCourse = {status:false, "message":"course registration successfull"};
      return res.status(200).send(registerCourse);

    }
    var registerCourse = {status:true, "message":" course registration failed"};
    console.log(err);
    return res.status(200).send(registerCourse);

  })
})

router.get('/courselist' , function(req,res){
Course.find({}, function (err, courseList){
  console.log(courseList)
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
      var loginResponse = {"profile":user ,status:true };

      return res.status(200).send(loginResponse);
    }
    else{
      var loginResponse = {status:false, "message":"login failed"};
      return res.status(200).send(loginResponse);
    }

  })

});

module.exports = router;

