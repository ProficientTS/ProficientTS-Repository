"use strict";
var express = require('express'),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    UserDAO = require('./users').UserDAO,
    ItemDAO = require('./data').ItemDAO,
    jwt = require('jsonwebtoken'),
    fs = require('fs');
var MongoOplog = require('mongo-oplog');

const oplog = MongoOplog('mongodb://cj777:cjchrist777@132.148.66.36:27017/cat', { ns: 'cat.*' })

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



process.env.SECRET_KEY = "IamProficient";
process.env.ServerURL = "http://192.169.169.6:3000/filesystem/";

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

    router.get("/filesystem/*", function(req, res) {
        "use strict";
        console.log(req.params['0']);
        var token;
        var fileFormat = "";
        var cType = "";
        // Handle tokened url file calls
        if (req.params['0'].indexOf('filetoken') > -1) {
            token = req.params['0'].split("/").pop();
            console.log("URL Token ----------> " + token);
            if (token) {
                jwt.verify(token, process.env.SECRET_KEY, function(err, decode) {
                    console.log("Decode")
                    console.log(decode);
                    if (err) {
                        res.json({
                            msg: "InValid Credential"
                        });
                    } else {
                        fileFormat = decode.url.split(".").pop();
                        console.log("fileFormat token url ---- " + fileFormat)
                        switch (fileFormat.toLowerCase()) {
                            case 'jpg':
                                cType = "image/jpg";
                                break;
                            case 'jpeg':
                                cType = "image/jpeg";
                                break;
                            case 'png':
                                cType = "image/png";
                                break;
                            case 'pdf':
                                cType = "application/pdf";
                                break;
                            case 'mp4':
                                cType = "video/mp4";
                                break;
                            default:
                                cType = "plain/text";
                        }
                        console.log(cType);
                        var fileToLoad = fs.readFileSync('./files/' + decode.url);
                        res.writeHead(200, { 'Content-Type': cType });
                        res.end(fileToLoad, 'binary');
                    }
                })
            } else {
                res.json({
                    msg: "Hello, we are {P}roficient. Please provide the right Credentials at the right Place ;)"
                });
            }
        } else {
            fileFormat = req.params['0'].split(".").pop();
            console.log("fileFormat simple get ---- " + fileFormat)
            switch (fileFormat.toLowerCase()) {
                case 'jpg':
                    cType = "image/jpg";
                    break;
                case 'jpeg':
                    cType = "image/jpeg";
                    break;
                case 'png':
                    cType = "image/png";
                    break;
                case 'pdf':
                    cType = "application/pdf";
                    break;
                case 'mp4':
                    cType = "video/mp4";
                    break;
                default:
                    cType = "plain/text";
            }
            console.log(cType);
            var fileToLoad = fs.readFileSync('./files/' + req.params['0']);
            res.writeHead(200, { 'Content-Type': cType });
            res.end(fileToLoad, 'binary');
        }

    });

    app.use('/', router);

    router.use(function(req, res, next) {
        console.log("Secure Routes");
        console.log(req.params);
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

    router.post("/sharemail", function(req, res) {
        "use strict";
        var that = this;
        var shareInfo = req.body;
        console.log(shareInfo);
        var msg = "";
        if (shareInfo.data.img.length) {
            msg = msg + "<div> Pictures (" + shareInfo.data.img.length + ")</div>";
            var txt = "";
            for (var i = 0; i < shareInfo.data.img.length; i++) {
                var imgurl = jwt.sign({ email: shareInfo.email, url: shareInfo.data.img[i].url }, process.env.SECRET_KEY, {
                    expiresIn: "10 days"
                })
                txt = txt + "<li><a href = '" + process.env.ServerURL + "filetoken/" + imgurl + "' target='_blank'>" + shareInfo.data.img[i].title + "</a></li>";
            }
            msg = msg + "<ul>" + txt + "</ul>";
        }
        if (shareInfo.data.video.length) {
            msg = msg + "<div> Videos (" + shareInfo.data.video.length + ")</div>";
            var txt = "";
            for (var i = 0; i < shareInfo.data.video.length; i++) {
                var videourl = jwt.sign({ email: shareInfo.email, url: shareInfo.data.video[i].url }, process.env.SECRET_KEY, {
                    expiresIn: "10 days"
                })
                txt = txt + "<li><a href = '" + process.env.ServerURL + "filetoken/" + videourl + "' target='_blank'>" + shareInfo.data.video[i].title + "</a></li>";
            }
            msg = msg + "<ul>" + txt + "</ul>";
        }
        if (shareInfo.data.doc.length) {
            msg = msg + "<div> Documents (" + shareInfo.data.doc.length + ")</div>";
            var txt = "";
            for (var i = 0; i < shareInfo.data.doc.length; i++) {
                var docurl = jwt.sign({ email: shareInfo.email, url: shareInfo.data.doc[i].url }, process.env.SECRET_KEY, {
                    expiresIn: "10 days"
                })
                txt = txt + "<li><a href = '" + process.env.ServerURL + "filetoken/" + docurl + "' target='_blank'>" + shareInfo.data.doc[i].title + "</a></li>";
            }
            msg = msg + "<ul>" + txt + "</ul>";
        }
        var body =
            `
        <html>
            <head>
            <title>Mail in Html</title>
            </head>
            <body>
            <p>
                <div> Review Comments </div>
                <div>
                ` + shareInfo.review + `
                </div>
            </p>
            <p>
                <div>
                ` + msg + `
                </div>
            </p>
            </body>
        </html>
        `;
        console.log(body);
        var email = {
            from: shareInfo.email,
            to: shareInfo.to.join(","),
            cc: shareInfo.cc.join(","),
            subject: 'Check these out',
            text: 'Hello from ProficientTS Applications.',
            html: body
        };
        users.sendMail(email, function(status, rst) {
            console.log(rst);
            console.log(status)
            if (status) {
                var userInfo = data.statsInfo(shareInfo);
                console.log(userInfo)
                data.saveStats(userInfo, function() {
                    res.json({
                        success: status,
                        msg: rst
                    });
                })

            } else {
                res.json({
                    success: status,
                    msg: rst
                });
            }
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
                    msg: 'Invalid Account or Password!'
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