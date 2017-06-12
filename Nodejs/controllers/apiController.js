var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
const util = require('util');
var jwt = require('jsonwebtoken');
var model = require('../models/model');
var user = model.user;
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert')

module.exports.checkuser = function(req, res, next) {
    console.log("Email")
    console.log(req.body)
    user.find({ email: req.body.email, active: true }, function(err, rst) {
        if (err) console.log(err);
        console.log(rst)

        if (rst.length) {
            res.json({
                success: false,
                msg: 'Account Already Exist. Try a different Account!'
            });
        } else {
            //signup call
            next();
        }

    });
}

module.exports.uservalidation = function(req, res) {
    console.log("Email - User - Validation")
    console.log(global.tokenDecode.email)
    user.find({ email: global.tokenDecode.email, active: true }, function(err, rst) {
        if (err) console.log(err);
        console.log(rst)

        if (rst.length) {
            res.json({
                success: true,
                msg: 'Account Exist.',
                data: rst
            });
        } else {
            res.json({
                success: false,
                msg: 'Account Does not Exist.'
            });
        }

    });
}


module.exports.verifymail = function(req, res) {
    console.log("Next function 200")
    var userData = req.body;
    console.log(userData)
    userData.temptoken = jwt.sign(userData, process.env.SECRET_KEY, {
        expiresIn: '24h'
    });
    console.log("temptoken " + userData.temptoken);
    var signupUser = new user(userData);
    console.log(signupUser);
    var userToUpdate = {};
    userToUpdate = Object.assign(userToUpdate, signupUser._doc);
    delete userToUpdate._id;
    console.log("User to Update")
    console.log(userToUpdate);
    // res.send(signupUser);
    user.update({ email: signupUser.email }, userToUpdate, { upsert: true }, (err, rst) => {
        if (err) console.log(err);
        else {
            console.log("Signup user saved")
            console.log(rst)
            var client = nodemailer.createTransport({
                service: 'Godaddy',
                auth: {
                    user: 'christson@proficientts.com',
                    pass: 'Fl)w3rd3nv3r'
                }
            })
            var email = {
                from: 'christson@proficientts.com',
                to: req.body.email,
                subject: 'Hello ' + req.body.email + ', Thank Jesus',
                text: 'Hello ' + req.body.email + ', thank you for registering at localhost.com.',
                html: 'Hello <strong>' + req.body.email + '</strong>, <br><br>Thank you for registering at localhost.com.'
            };

            client.sendMail(email, function(err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(util.inspect(info, { showHidden: false, depth: null }));
                    res.json({
                        success: true,
                        msg: 'Please check your email for the confirmation mail!',
                        temptoken: userData.temptoken
                    });
                }
            });
        }

    });

}
module.exports.activateUser = function(req, res) {
    console.log("SignUp Activation");
    console.log(global.tokenDecode);
    var data = {
        email: global.tokenDecode.email,
        password: global.tokenDecode.password
    };
    var token = jwt.sign(data, process.env.SECRET_KEY, {
        expiresIn: '48h'
    });
    user.update({ temptoken: req.body.token }, { $set: { active: true, token: token, temptoken: '' } }, (err, rst) => {
        if (err) {
            console.log(err);
        } else {
            console.log("johnny")
            console.log(rst)
            console.log("Sign Up User Activated");
            var client = nodemailer.createTransport({
                service: 'Godaddy',
                auth: {
                    user: 'christson@proficientts.com',
                    pass: 'Fl)w3rd3nv3r'
                }
            })
            console.log(global.tokenDecode.email);
            var email = {
                from: 'christson@proficientts.com',
                to: global.tokenDecode.email,
                subject: 'Hello ' + global.tokenDecode.email + ', Thank Jesus',
                text: 'Your account is now Active!',
                html: 'Your account is now Active!'
            };

            client.sendMail(email, function(err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(util.inspect(info, { showHidden: false, depth: null }));
                    res.json({
                        success: true,
                        token: token,
                        msg: 'Welcome, ' + global.tokenDecode.email + '!'
                    });
                }
            });

        }
    });
}











module.exports.other = function(app) {

    app.get('/api/todos/:uname', function(req, res) {

        Todos.find({ username: req.params.uname }, function(err, todos) {
            if (err) throw err;

            res.send(todos);
        });

    });

    app.get('/api/todo/:id', function(req, res) {

        Todos.findById({ _id: req.params.id }, function(err, todo) {
            if (err) throw err;

            res.send(todo);
        });

    });

    app.post('/api/todo', function(req, res) {

        if (req.body.id) {
            Todos.findByIdAndUpdate(req.body.id, { username: req.body.username, todo: req.body.todo, isDone: req.body.isDone, hasAttachment: req.body.hasAttachment }, function(err, todo) {
                if (err) throw err;

                res.send('Success');
            });
        } else {

            var newTodo = Todos({
                username: req.body.username,
                todo: req.body.todo,
                isDone: req.body.isDone,
                hasAttachment: req.body.hasAttachment
            });
            newTodo.save(function(err) {
                if (err) throw err;
                res.send('Success');
            });

        }

    });

    app.delete('/api/todo', function(req, res) {

        Todos.findByIdAndRemove(req.body.id, function(err) {
            if (err) throw err;
            res.send('Success');
        })

    });
}



module.exports.postData = function(req, res) {

    if (req.body.id) {
        Todos.findByIdAndUpdate(req.body.id, { username: req.body.username, todo: req.body.todo, isDone: req.body.isDone, hasAttachment: req.body.hasAttachment }, function(err, todo) {
            if (err) throw err;

            res.send('Success1');
        });
    } else {

        var newTodo = Todos({
            username: req.body.username,
            todo: req.body.todo,
            isDone: req.body.isDone,
            hasAttachment: req.body.hasAttachment
        });
        newTodo.save(function(err) {
            if (err) throw err;
            res.send('Success2');
        });

    }
}

module.exports.getData = function(req, res) {
    console.log(req.body.username);
    res.send('Hi');
}

module.exports.chksignin = function(req, res, next) {
    console.log("Login");
    user.find({ email: req.body.email, active: true }, function(err, rst) {
        if (err) console.log(err);

        console.log(rst);

        if (rst.length) {
            console.log(rst.password);
            console.log(req.body.password)
            if (rst[0].password === req.body.password)
                next();
            else
                res.json({
                    success: false,
                    msg: 'Incorrect username or password!'
                });
        } else {
            res.json({
                success: false,
                msg: 'Invalid Account!'
            });
        }
    });
}

module.exports.authenticate = function(req, res) {
    var token = jwt.sign(req.body, process.env.SECRET_KEY, {
        expiresIn: 3600
    });
    user.update({ email: req.body.email }, { $set: { token: token } }, (err, rst) => {
        if (err) {
            console.log(err);
        } else {
            res.json({
                success: true,
                token: token
            })
        }
    });



}

module.exports.checkfpuser = function(req, res) {
    console.log("Email")
    console.log(req.body)
    user.find({ email: req.body.email, active: true }, function(err, rst) {
        if (err) console.log(err);
        console.log(rst)
        if (rst.length) {
            var temptoken = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY, {
                expiresIn: '24h'
            });

            var client = nodemailer.createTransport({
                service: 'Godaddy',
                auth: {
                    user: 'christson@proficientts.com',
                    pass: 'Fl)w3rd3nv3r'
                }
            })
            var email = {
                from: 'christson@proficientts.com',
                to: req.body.email,
                subject: 'Hello ' + req.body.email + ', Thank Jesus',
                text: 'Hello ' + req.body.email + ', click this link to reset your password.',
                html: 'Hello <strong>' + req.body.email + '</strong>, <br><br>click this link to reset your password.<div> <a href = "http://localhost:4200/forgotpwd/' + temptoken + '"> Reset Pwd </a></div>'
            };

            client.sendMail(email, function(err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(util.inspect(info, { showHidden: false, depth: null }));
                    res.json({
                        success: true,
                        msg: 'Please check your email for Resetting your Password!'
                    });
                }
            });
        } else {
            res.json({
                success: false,
                msg: 'Not a valid user!'
            });
        }

    });
}

module.exports.resetpwd = function(req, res) {
    console.log(global.tokenDecode.email)
    user.update({ email: global.tokenDecode.email }, { $set: { password: req.body.pwd } }, (err, rst) => {
        if (err) console.log(err);
        else {
            res.json({
                success: true,
                msg: 'Password Reset Successful!'
            });
        }
    });
}

// list

module.exports.list = function(req, res) {
    console.log("Type ----- ");
    console.log(req.body);
    MongoClient.connect('mongodb://localhost:27017/catalog', function(err, db) {
        "use strict";

        assert.equal(null, err);
        console.log("Succssfully connected to MongoDB.");
        // var query = { _id: itemId };
        var query = [];
        switch (req.body.type) {

            case "technique":
                query = [{ $unwind: "$technique" }, { $project: { "technique": 1 } }, { $group: { _id: "$technique" } }, { $project: { "name": "$_id", _id: 0 } }, { $sort: { name: 1 } }];
                // query = [{ $unwind: "$technique" }, { $match: { technique: 'Sparticle' } }, { $group: { _id: "$technique", system: { $push: "$system_nm" } } }, { $project: { _id: 0, system: 1 } }, { $unwind: "$system" }, { $project: { name: "$system" } }, { $sort: { name: 1 } }];
                var cursor = db.collection('system').aggregate(query);
                break;
            case "system":
                var cursor = db.collection('system').aggregate([{ $project: { _id: 0, name: "$system_nm" } }, { $sort: { name: 1 } }]);
                break;
            case "set":
                var cursor = db.collection('system').aggregate([{ $unwind: "$set" }, { $project: { "set": 1 } }, { $group: { _id: "$set.set_nm" } }, { $project: { name: "$_id", _id: 0 } }, { $sort: { name: 1 } }]);
                break;
            case "group":
                var cursor = db.collection('system').aggregate([{ $unwind: "$group" }, { $project: { "group": 1 } }, { $group: { _id: "$group.group_nm", } }, { $project: { name: "$_id", _id: 0 } }, { $sort: { name: 1 } }]);
                break;
            case "part":
                var cursor = db.collection('system').aggregate([{ $unwind: "$set" }, { $project: { set: 1 } }, { $group: { _id: "$set.part.part_nm" } }, { $unwind: "$_id" }, { $group: { _id: "$_id" } }, { $project: { name: "$_id", _id: 0 } }, { $sort: { name: 1 } }]);
                break;
        }

        cursor.toArray(function(err, item) {
            console.log(item)
            assert.equal(null, err);
            res.json({
                success: true,
                data: item
            });
        });
    });
}