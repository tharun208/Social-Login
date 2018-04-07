var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var morgan = require('morgan');
var mysql=require('mysql');
var QRCode = require('qrcode');
var passport = require('passport');
var speakeasy = require('speakeasy');
<<<<<<< Updated upstream
var helmet=require('helmet');
=======
var session = require('express-session')
>>>>>>> Stashed changes
var f2util=require('./2fauth/2factorauthservice.js');
var mysqlconnection = mysql.createConnection(
  {
    user     : 'root',
    host     : 'localhost',
    password : 'tharun',
    database : 'backend',
  });
mysqlconnection.connect(function(err){
  if(err)
  {
    console.log('not connected');
  }
});
const app= express();
app.use(morgan('combined'));
app.use('views', express.static(__dirname + '/views'));
app.set('view engine', 'pug');
app.use( bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.use(session({ secret: 'heimdallhassoulstone',
                  resave: false,
                  saveUninitialized: false }));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.get('/',function(req,res){
	res.set({
		'Access-Control-Allow-Origin' : '*'
	});
	 res.render('index.pug');
})
app.get('/login',function(req,res){
  res.render('login.pug');
});
app.post('/sign_up',function(req,res){
  if(req.body) {
    console.log(req.body)
    if(req.body.password===req.body.confirmpassword) {
    if(req.body.f2a === 'on') {
    var secret = speakeasy.generateSecret({length: 20});
    const InsertQuery="Insert into users (name,email,password,mobile,dob,secretKey) VALUES ('"+req.body.name+"','"+req.body.email+"','"+req.body.password+"','"+req.body.phone+"','"+req.body.dob+"','"+f2util.generateKey(secret)+"')";
    mysqlconnection.query(InsertQuery,function(err, result)
{
  if (err)
     res.send(err);
});
    QRCode.toDataURL(secret.otpauth_url).then(url =>{
    console.log(url);
    res.send('<body><p>Scan Below QrCode To Enable 2Factor Authentication</p><br><img src='+url+'>'+'<a href=/>Back to Index Page</a></body>');
    });
  } else {
     console.log('I am Here');
    const InsertQuery="Insert IGNORE into users (name,email,password,mobile,dob) VALUES ('"+req.body.name+"','"+req.body.email+"','"+req.body.password+"','"+req.body.phone+"','"+req.body.dob+"')";
    mysqlconnection.query(InsertQuery,function(err, result)
{
  if (err)
     console.log(err);
});
    res.render('index',{message:'SignUp Successful'});
  }
} else {
  res.render('index',{failmessage:'Password Not Matching'});
}
} else {
    res.render('index',{failmessage:'SignUp Failed'});
  }
});
app.post('/login',function(req,res){
  if(req.body) {
    const SearchQuery="select * from users where email='"+req.body.email+"'";
    mysqlconnection.query(SearchQuery,function(err, rows) {
  if (err) {
     res.send(err);
   } else {
     if(rows[0]) {
     if(rows[0].password === req.body.password) {
       if(rows[0].secretKey) {
        if(f2util.checkForToken(rows[0].secretKey,req.body.token))
        {
          req.session.name=rows[0].name;
          req.session.email=rows[0].email;
          res.redirect('/profile');
     } else {
       res.render('login',{message:'Token Verification Failed'});
     }
   } else {
     req.session.name=rows[0].name;
     req.session.email=rows[0].email;
     res.redirect('/profile');
     //res.render('profile',{params:{message:'Login Successful',param1:rows[0].name,param2:rows[0].email}})
   }
     } else {
       res.render('login',{message:'Invalid Password'});
     }
   } else {
     res.render('login',{message:'Invalid EmailId'});
   }
   }
 });
} else {
    res.render('login',{message:'Login Failed'});
  }
});
app.get('/profile',function(req,res){
  console.log(req.session);
  if(req.session.name && req.session.email) {
  res.render('profile',{params:{message:'Login Successful',param1:req.session.name,param2:req.session.email}})
}
else {
  res.redirect('/login');
}
})
//FaceBook Routes
require('./passport/passport.js')(passport,mysqlconnection);
app.get('/auth/facebook', passport.authenticate('facebook',{scope :'email'}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook'),
  function(req, res) {
    req.session.name=req.user.displayName;
    req.session.email=req.user.emails[0].value;
    res.redirect('/profile');
  });
//Google Routes
app.get('/auth/google', passport.authenticate('google',{scope:'email'}));

app.get('/auth/google/callback',
  passport.authenticate('google'),
  function(req, res) {
  req.session.name=req.user.displayName;
  req.session.email=req.user.emails[0].value;
  res.redirect('/profile');
  });
  app.get('/logout',function(req,res){
  req.session.destroy(function(err) {
  if(err) {
    console.log(err);
  } else {
    res.redirect('/');
  }
});
});
app.listen(8081,()=>{console.log('server running at port 8081')});
