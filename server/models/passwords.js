const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const passwordItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    iv: { type: String },
    url: { type: String },
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true } // Add _id field for each password item
});

const passwordSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
    },
    passwords: {
        type: [passwordItemSchema],
        required: true
    },
});

const Passwords = mongoose.model('passwords', passwordSchema);

const validate = (data) => {
    const schema = Joi.object({
        userEmail: Joi.string().email().required().label("Email"),
        passwords: Joi.object({
            title: Joi.string().required().label("Title"),
            username: Joi.string().required().label("Username"),
            password: Joi.string().required().label("Password"),
            url: Joi.string().optional().label("URL"),
        }).required().label("Passwords"),
    });
    return schema.validate(data);
}

module.exports = {Passwords, validate}