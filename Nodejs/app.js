var express = require('express');
var app = express();
// var mongoose = require('mongoose');
// var jwt = require('jsonwebtoken');
// var config = require('./config');
// var bodyParser = require('body-parser');
// const util = require('util');
// var setupController = require('./controllers/setupController');
// var apiController = require('./controllers/apiController');
// var authController = require('./controllers/authController');
// global._ = require('underscore');
// var secureRoutes = express.Router();
// process.env.SECRET_KEY = "cj777key";
// var port = process.env.PORT || 777;
// var model = require('./models/model');
// var user = model.user;
// mongoose.connect('mongodb://localhost:27017/user');
// app.use('/assets', express.static(__dirname + '/public'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/secure-api', secureRoutes);

// app.set('view engine', 'ejs');
// secureRoutes.use(function(req, res, next) {
//     console.log("Secure Routes");
//     var token = req.body.token || req.headers['token'];
//     if (token) {
//         jwt.verify(token, process.env.SECRET_KEY, function(err, decode) {
//             console.log("Decode")
//             console.log(decode);
//             global.tokenDecode = decode;
//             if (err) {
//                 res.status(500).send("Invalid Token");
//             } else {
//                 console.log("Secure Routes Inner");
//                 next();
//             }
//         })
//     } else {
//         res.send(
//             "please send token"
//         );
//     }
// })


// // mongoose.Promise = require('bluebird');
// setupController(app);
// // apiController(app);
// app.post('/auth', apiController.chksignin, apiController.authenticate);
// app.post('/list', apiController.list);
// secureRoutes.post('/post-data', apiController.postData);
// secureRoutes.post('/saveUserSignUp', apiController.activateUser);
// app.post('/checkuser/signup', apiController.checkuser, apiController.verifymail);
// secureRoutes.post('/get-data', apiController.getData);
// app.post('/get-data', apiController.getData);
// app.post('/checkfpuser', apiController.checkfpuser);
// secureRoutes.post('/resetpwd', apiController.resetpwd);
// secureRoutes.post('/uservalidation', apiController.uservalidation);
app.listen(port, function() {
    console.log("Server is Up, Yeah !!!");
});