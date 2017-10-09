var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    nodemailer = require('nodemailer'),
    jwt = require('jsonwebtoken');

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
        console.log(userInfo)
        var query = (userInfo.password) ? { email: userInfo.email, password: userInfo.password, active: true, voidfl: { $ne: 'Y' } } : { email: userInfo.email, active: true, voidfl: { $ne: 'Y' } };
        var cursor = this.db.collection('user').find(query);

        cursor.toArray(
            function(err, doc) {
                assert.equal(err, null);
                console.log("checkUser Result")
                    // console.log(doc)

                callback(doc);
            }
        );
    }

    this.resetpwd = function(email, pwd, callback) {
        "use strict";
        this.db.collection('user').update({ email: email, voidfl: { $ne: 'Y' } }, { $set: { password: pwd } },
            function(err, doc) {
                assert.equal(err, null);
                console.log("resetpwd Result")
                console.log(doc)

                callback(doc);
            }
        );
    }

    this.updateUserToken = function(userInfo, token, callback) {
        "use strict";

        this.db.collection('user').update({ email: userInfo.email, voidfl: { $ne: 'Y' } }, { $set: { token: token } },
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
                    // console.log(doc)

                callback(doc);
            }
        );
    }

    this.sendMail = function(email, callback) {
        "use strict";

        client.sendMail(email, function(err, info) {
            if (err) {
                console.log(err);
            } else {
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