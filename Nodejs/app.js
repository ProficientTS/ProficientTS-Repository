"use strict";
var express = require('express'),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    UserDAO = require('./users').UserDAO,
    ItemDAO = require('./data').ItemDAO,
    jwt = require('jsonwebtoken');
var MongoOplog = require('mongo-oplog');

const oplog = MongoOplog('mongodb://cj777:cjchrist777@132.148.66.36:27017/cat', { ns: 'cat.*' })

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



process.env.SECRET_KEY = "IamProficient";

MongoClient.connect('mongodb://cj777:cjchrist777@132.148.66.36:27017/cat', function(err, db) {
    "use strict";

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    var users = new UserDAO(db);
    var data = new ItemDAO(db);

    var router = express.Router();

    router.post("/auth", function(req, res) {
        console.log("auth ----------")
        "use strict";
        var userInfo = req.body;
        users.checkUser(userInfo, function(user) {
            if (user.length) {
                var token = jwt.sign(userInfo, process.env.SECRET_KEY, {
                    expiresIn: 172800
                        // 2 days
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

    app.use('/', router);

    router.use(function(req, res, next) {
        console.log("Secure Routes");
        var token = req.body.token || req.headers['token'];
        if (token) {
            jwt.verify(token, process.env.SECRET_KEY, function(err, decode) {
                console.log("Decode")
                console.log(decode);

                if (err) {
                    res.json({
                        msg: "InValid Credential"
                    });
                } else {
                    global.tokenDecode = decode;
                    console.log("Secure Routes Inner");
                    next();
                }
            })
        } else {
            res.json({
                msg: "Hello, we are {P}roficient. Please provide the right Credentials at the right Place ;)"
            });
        }
    });

    router.post("/list/:type", fnGetData);
    router.post("/display/:type/:id", fnGetData);
    router.post("/list/:type/name/:name", fnGetData);
    router.post("/list/:type/:id/:type2", fnGetData);

    function fnGetData(req, res) {
        "use strict";
        var typeInfo = req.body;
        var type = req.params.type;
        var id = req.params.id;
        var type2 = req.params.type2;
        var name = req.params.name;
        var view = "list";
        if (id && type && type2 === undefined) {
            view = "display"
        }
        console.log('typeInfo')
        console.log(type)
        console.log('type2')
        console.log(type2);
        console.log("View ---- " + view);
        console.log(id);
        console.log(name)
        if (type == "key") {
            data.listByKeyword(name, function(status, rst) {
                res.json({
                    success: status,
                    msg: 'List Result!',
                    data: rst
                });
            });
        } else {
            data.listItem(id, type, type2, name, view, function(rst) {
                res.json({
                    success: true,
                    msg: 'List Result!',
                    data: rst
                });
            });
        }
    }

    router.post("/sync", function(req, res) {

        "use strict";
        var syncInfo = req.body;
        console.log(syncInfo.deviceID)
        if (syncInfo.update == "Y") {
            //Update logic
            console.log("Update Sync")
            data.updateSync(syncInfo, function(rst) {

                console.log(rst)
                if (Object.keys(rst).length == 0) {
                    rst = [];
                }
                if (rst.full) {
                    res.json({
                        success: false,
                        msg: 'Update Sync Failed - Yet to take Fresh Sync'
                    });
                } else if (rst) {
                    res.json({
                        success: true,
                        msg: 'SuccessFull Update Sync',
                        data: rst
                    });

                } else {
                    res.json({
                        success: false,
                        msg: 'Update Sync Failed'
                    });
                }
            });
        } else {
            // Full Sync
            data.fnFullSync(syncInfo, function(rst) {
                if (Object.keys(rst).length) {
                    res.json({
                        success: true,
                        msg: 'SuccessFull Full Sync',
                        data: rst
                    });

                } else {
                    res.json({
                        success: false,
                        msg: 'Full Sync Failed'
                    });
                }
            });
        }

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

    router.post("/resendmail", function(req, res) {
        "use strict";
        var userInfo = req.body;
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
                msg: 'Account Activated'
            });
        })
    });

    router.post("/forgotpwd", function(req, res) {
        "use strict";
        var userInfo = req.body;
        users.checkUser(userInfo, function(user) {
            console.log("User JSON ---------")
            console.log(user)

            if (user.length) {
                var password = user[0].password;
                var email = {
                    from: 'christson@proficientts.com',
                    to: userInfo.email,
                    subject: 'Hello ' + userInfo.email + ', Thank Jesus',
                    text: 'Hello ' + userInfo.email + ', your password is ' + password + '.',
                    html: 'Hello <strong>' + userInfo.email + '</strong>, <br><br>your password is ' + password + '.'
                };
                users.sendMail(email, function() {
                    res.json({
                        success: true,
                        msg: 'Your password has been sent to your mail. Please Check your mail.'
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
        users.checkUser(userInfo, function(user) {
            if (user.length) {
                users.resetpwd(userInfo.email, userInfo.pwd, function(user) {
                    res.json({
                        success: true,
                        msg: 'Password Reset Successful!'
                    });
                });

            } else {
                res.json({
                    success: false,
                    msg: 'Password Reset Failed. Invalid Credentials!'
                });
            }
        });
    });

    // Use the router routes in our application
    app.use('/', router);

    // Start the server listening
    var server = app.listen(3000, "0.0.0.0");

    oplog.tail();

    oplog.on('op', data => {
        console.log("Operations -------------------")
            // console.log(data);
        if (data.ns == 'cat.part' ||
            data.ns == 'cat.set' ||
            data.ns == 'cat.system' ||
            data.ns == 'cat.technique' ||
            data.ns == 'cat.file') {
            console.log(data);
            fnTrigger(data.op, (data.o2) ? data.o2 : data.o, data.ns.replace('cat.', ''));
        }
    });

    function fnTrigger(op, d, type) {
        console.log("Catalog Trigger --------------");
        console.log(op);
        console.log(d);
        console.log(type);
        var voidfl = '';
        voidfl = (op == 'd') ? 'Y' : '';
        var masterSync = data.MasterSyncInfo(d['_id'], type, voidfl);
        console.log("masterSync on Trigger")
        console.log(masterSync)
        data.updateMaster(masterSync, function(rst) {
            if (Object.keys(rst).length) {
                console.log("Master Sync Successful!!!");
            } else {
                console.log("Master Sync Failed!!!");
            }
        })
    }

});