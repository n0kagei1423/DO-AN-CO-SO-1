const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
});

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
}

const User = mongoose.model('user', userSchema);

const validate = (data) => {
    const schema = Joi.object({
        username: Joi.string().required().label('Username'),
        email: Joi.string().required().label('Email'),
        password: passwordComplexity().required().label("Password"),
    });

    return schema.validate(data);
}

module.exports = {User,validate}