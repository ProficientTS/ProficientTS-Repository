var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    nodemailer = require('nodemailer');

var client = nodemailer.createTransport({
    service: 'Godaddy',
    auth: {
        user: 'christson@proficientts.com',
        pass: 'Fl)w3rd3nv3r'
    }
});

function UserDAO(database) {
    "use strict";

    this.db = database;

    this.checkUser = function(userInfo, callback) {
        "use strict";

        var query = { email: userInfo.email, password: userInfo.password, active: true };
        var cursor = this.db.collection('user').find(query);

        cursor.toArray(
            function(err, doc) {
                assert.equal(err, null);
                console.log("checkUser Result")
                console.log(doc)

                callback(doc);
            }
        );
    }

    this.updateUserToken = function(userInfo, token, callback) {
        "use strict";

        var cursor = this.db.collection('user').update({ email: userInfo.email }, { $set: { token: token } },
            function(err, doc) {
                assert.equal(err, null);
                console.log("checkUser Result")
                console.log(doc)

                callback(doc);
            }
        );
    }

    this.createUser = function(userInfo, callback) {
        "use strict";

        var query = userInfo;
        console.log("Create User");
        this.db.collection('user').insert(userInfo,
            function(err, doc) {
                assert.equal(err, null);
                console.log("Create User Result")
                console.log(doc)

                callback(doc);
            }
        );
    }

    this.sendConfirmMail = function(userInfo, callback) {
        "use strict";
        var email = {
            from: 'christson@proficientts.com',
            to: userInfo.email,
            subject: 'Hello ' + userInfo.email + ', Thank Jesus',
            text: 'Hello ' + userInfo.email + ', thank you for registering for ProficientTS Applications.',
            html: 'Hello <strong>' + userInfo.email + '</strong>, <br><br>Thank you for registering for ProficientTS Applications.'
        };
        client.sendMail(email, function(err, info) {
            if (err) {
                console.log(11111)
                console.log(err);
            } else {
                console.log(222222)
                callback();
            }
        });
    }

    this.createDummyUser = function(userInfo, token) {
        "use strict";

        var user = {
            email: userInfo.email,
            password: userInfo.password,
            token: token,
            active: true
        };

        return user;
    }
}


module.exports.UserDAO = UserDAO;