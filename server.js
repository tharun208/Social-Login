var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var morgan = require('morgan');
var mysql=require('mysql');
var QRCode = require('qrcode');
var passport = require('passport');
var speakeasy = require('speakeasy');
var f2util=require('./2fauth/2factorauthservice.js');
var mysqlconnection = mysql.createConnection(
  {
    host     : 'localhost',
    user     : 'root',
    password : '',
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
    if(req.body.f2a == 'true') {
    var secret = speakeasy.generateSecret({length: 20});
    const InsertQuery="Insert into users (name,email,password,mobile,dob,secretKey) VALUES ('"+req.body.name+"','"+req.body.email+"','"+req.body.password+"','"+req.body.phone+"','"+req.body.dob+"','"+f2util.generateKey(secret)+"')";
    mysqlconnection.query(InsertQuery,function(err, result)
{
  if (err)
     res.send(err);
});
    QRCode.toDataURL(secret.otpauth_url).then(url =>{
    console.log(url);
    res.send('<body><p>Scan Below QrCode To Enable 2Factor Authentication</p><br><img src='+url+'>'+'</body>');
    });
  } else if(req.body.f2a== 'false') {
    const InsertQuery="Insert into users (name,email,password,mobile,dob) VALUES ('"+req.body.name+"','"+req.body.email+"','"+req.body.password+"','"+req.body.phone+"','"+req.body.dob+"')";
    mysqlconnection.query(InsertQuery,function(err, result)
{
  if (err)
     res.send(err);
});
    res.render('index',{message:'SignUp Successful'});
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
       res.render('profile',{params:{message:'Login Successful',param1:rows[0].name,param2:rows[0].email}});
     } else {
       res.render('login',{message:'Token Verification Failed'});
     }
   } else {
    res.render('profile',{params:{message:'Login Successful',param1:rows[0].name,param2:rows[0].email}})
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
//FaceBook Routes
require('./passport/passport.js')(passport,mysqlconnection);
app.get('/auth/facebook', passport.authenticate('facebook',{scope :'email'}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook'),
  function(req, res) {
    console.log(res);
    res.render('profile',{params:{message:'Login Successful',param1:req.user.id,param2:req.user.displayName}})
  });
//Google Routes
app.get('/auth/google', passport.authenticate('google',{scope:'email'}));

app.get('/auth/google/callback',
  passport.authenticate('google'),
  function(req, res) {
  console.log(req.user.displayName)
  res.render('profile',{params:{message:'Login Successful',param1:req.user.displayName,param2:req.user.emails[0].value}})
  });
app.listen(8081,()=>{console.log('server running at port 8081')});
