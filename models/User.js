const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Note = require('./Note');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    } catch (error) {
        return next(error);
    }
});


UserSchema.statics.getUserNotes = async function (userId) {
    try {
        return await Note.find({userId: userId}).sort({createdAt: -1});
    } catch (error) {
        return error;
    }
}

module.exports = mongoose.model('User', UserSchema);