const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName : String,
    UserEmail : String,
    password : String,
    role : String
})

module.exports = mongoose.model("User", UserSchema);