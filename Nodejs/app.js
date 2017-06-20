var express = require('express'),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    UserDAO = require('./users').UserDAO,
    jwt = require('jsonwebtoken');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

process.env.SECRET_KEY = "cj777key";

MongoClient.connect('mongodb://localhost:27017/cat', function(err, db) {
    "use strict";

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    var users = new UserDAO(db);

    var router = express.Router();

    router.post("/auth", function(req, res) {
        "use strict";
        var userInfo = req.body;
        users.checkUser(userInfo, function(user) {
            if (user.length) {
                var token = jwt.sign(userInfo, process.env.SECRET_KEY, {
                    expiresIn: 3600
                })
                users.updateUserToken(userInfo, token, function(userTokenUpdate) {
                    res.json({
                        success: true,
                        msg: 'Valid Account!',
                        data: user,
                        token: token
                    });
                })

            } else {
                res.json({
                    success: false,
                    msg: 'Invalid Account!'
                });
            }
        });
    });

    router.post("/signup", function(req, res) {
        "use strict";
        var userInfo = req.body;
        users.checkUser(userInfo, function(user) {
            console.log(user.length)
            if (user.length) {
                res.json({
                    success: false,
                    msg: 'Account Already Exist. Provide a different Account!'
                });

            } else {
                var token = jwt.sign(userInfo, process.env.SECRET_KEY, {
                    expiresIn: 3600
                })
                var userData = users.createDummyUser(userInfo, token);
                console.log(userData)
                users.createUser(userData, function(createUser) {
                    if (createUser.result.ok == 1) {
                        var email = {
                            from: 'christson@proficientts.com',
                            to: userInfo.email,
                            subject: 'Hello ' + userInfo.email + ', Thank Jesus',
                            text: 'Hello ' + userInfo.email + ', thank you for registering for ProficientTS Applications.',
                            html: 'Hello <strong>' + userInfo.email + '</strong>, <br><br>Thank you for registering for ProficientTS Applications.'
                        };
                        users.sendMail(email, function() {
                            res.json({
                                success: true,
                                msg: 'Account Activated',
                                data: userData,
                                token: token
                            });
                        })
                    }
                })
            }
        });
    });


    router.post("/forgotpwd", function(req, res) {
        "use strict";
        var userInfo = req.body;
        users.checkUser(userInfo, function(user) {
            if (user.length) {
                var token = jwt.sign(userInfo, process.env.SECRET_KEY, {
                    expiresIn: 3600
                })
                var temptoken = jwt.sign({ email: userInfo.email }, process.env.SECRET_KEY, {
                    expiresIn: '24h'
                });
                var email = {
                    from: 'christson@proficientts.com',
                    to: userInfo.email,
                    subject: 'Hello ' + userInfo.email + ', Thank Jesus',
                    text: 'Hello ' + userInfo.email + ', click this link to reset your password.',
                    html: 'Hello <strong>' + userInfo.email + '</strong>, <br><br>click this link to reset your password.<div> <a href = "http://localhost:4200/forgotpwd/' + temptoken + '"> Reset Pwd </a></div>'
                };
                users.sendMail(email, function() {
                    res.json({
                        success: true,
                        msg: 'Please check your email for Resetting your Password!'
                    });
                })

            } else {
                res.json({
                    success: false,
                    msg: 'Invalid Account!'
                });
            }
        });
    });

    router.post("/resetpwd", function(req, res) {
        "use strict";
        var userInfo = req.body;
        jwt.verify(userInfo.token, process.env.SECRET_KEY, function(err, decode) {
            console.log("Decode")
            console.log(decode);
            if (err) {
                res.json({
                    success: false,
                    msg: 'Password Reset Failed. Invalid Credentials!'
                });
            } else {
                users.resetpwd(decode.email, userInfo.pwd, function(user) {
                    res.json({
                        success: true,
                        msg: 'Password Reset Successful!'
                    });
                });
            }
        })

    });

    // Use the router routes in our application
    app.use('/', router);

    // Start the server listening
    var server = app.listen(777, function() {
        var port = server.address().port;
        console.log('Mongomart server listening on port %s.', port);
    });

});

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
// app.listen(port, function() {
//     console.log("Server is Up, Yeah !!!");
// });