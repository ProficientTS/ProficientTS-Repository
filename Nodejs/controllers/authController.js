var jwt = require('jsonwebtoken');

module.exports.authenticate = function(req, res) {
    var user = {
        username: 'cj',
        password: 'cjchrist777'
    }
    var token = jwt.sign(user, process.env.SECRET_KEY, {
        expiresIn: 3600
    });

    res.json({
        success: true,
        token: token
    })
}