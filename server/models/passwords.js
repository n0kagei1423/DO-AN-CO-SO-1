const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const passwordSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
    },
    passwords: {
        type: [Object],
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