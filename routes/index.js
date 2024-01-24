var express = require('express');
var router = express.Router();
const userModel= require('./users')
const upload= require('./multer')

const moment = require('moment');


const passport= require('passport')
const localStrategy= require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));


/* GET home page. */
router.get('/', async function(req, res) {
  let element= await userModel.find();
  console.log(element)
  res.render('index', { element:element });
});

router.get('/signup', function(req, res) {
  res.render('signup');
});

router.get('/login', function(req, res) {
  res.render('login', {error: req.flash('error')});
});

router.get('/shareProject', function(req, res) {
  res.render('shareProject');
});
router.get('/profile', isLoggedIn, async function(req, res) {
  let user= await userModel.findOne({username: req.session.passport.user})
  res.render('profile', {user:user});
});


router.post('/register', function (req,res ){
  console.log(req.body)
  const {email, username}= req.body;

  const user= new userModel({username, email});
  userModel.register(user, req.body.password)
  .then(function(){
  passport.authenticate("local")(req , res, function(){
    res.redirect('/profile')
    console.log('authenticated')
  })
})
  
})

router.post('/login',passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect: '/login',
  failureFlash: true
}),function(req , res){})

router.post('/submitProject',isLoggedIn , upload.single("file"), async function(req , res){

  if(!req.file){
    return res.status(404).send('no file is given')
  }
  const date= moment().format('DD-MM-YYYY');

  const user=  await userModel.findOne({username : req.session.passport.user})
  console.log(user)
  user.projects.push( {
    projectName:req.body.projectname,
    projectLink: req.body.link, 
    username: req.body.studentname,
    image: req.file.filename,
    dateOfUpload: date }
);
  await user.save();
  res.render('shareProject')


})


router.get('/logout', function (req, res) {
  req.logout(function(err) {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/');
  });
});

function isLoggedIn(req , res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}


module.exports = router;
