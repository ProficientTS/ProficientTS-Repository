var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var todoSchema = new Schema({
    username: String,
    todo: String,
    isDone: Boolean,
    hasAttachment: Boolean
});

var userSchema = new Schema({
    email: { type: String },
    password: { type: String },
    active: { type: String, default: false },
    temptoken: { type: String, default: false },
    token: { type: String, default: false }
})

var Todos = mongoose.model('Todos', todoSchema);
var user = mongoose.model('user', userSchema);

module.exports.todos = Todos;
module.exports.user = user;