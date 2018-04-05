var speakeasy = require('speakeasy');
var QRCode = require('qrcode');
module.exports = {
generateKey:function(secret) {
  return secret.base32;
},
checkForToken:function(secretKey,userToken)
{
  var verified = speakeasy.totp.verify({
  secret: secretKey,
  encoding: 'base32',
  token: userToken
});
return verified;
}
}
