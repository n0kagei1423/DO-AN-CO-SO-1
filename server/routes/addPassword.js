const router = require('express').Router();
const { User } = require('../models/user');
const { encrypt, decrypt } = require("../utils/crypto/EncryptionHandler")
const dotenv = require("dotenv");
const Joi = require("joi");
const mongoose = require('mongoose');
const { Passwords } = require('../models/passwords');
dotenv.config({ path: "./database/.env" });

router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });
        // Find the user by email
        const user = await User.findOne({ email: req.body.userEmail });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        const encryptedPassword = encrypt(req.body.passwords.password);

        if (req.body.passwords._id) {
            const passwordId = new mongoose.Types.ObjectId(req.body.passwords._id);

            const result = await Passwords.findOneAndUpdate(
                {
                    userEmail: req.body.userEmail,
                    "passwords._id": passwordId
                },
                {
                    $set: {
                        "passwords.$.title": req.body.passwords.title,
                        "passwords.$.username": req.body.passwords.username,
                        "passwords.$.password": encryptedPassword.password,
                        "passwords.$.iv": encryptedPassword.iv,
                        "passwords.$.url": req.body.passwords.url
                    }
                },
                { new: true }
            );
            if (!result) {
                return res.status(404).send({ message: "Password not found for update" });
            }
        } else {
            await Passwords.findOneAndUpdate(
                { userEmail: req.body.userEmail },
                {
                    $push: {
                        passwords: {
                            _id: new mongoose.Types.ObjectId(),
                            title: req.body.passwords.title,
                            username: req.body.passwords.username,
                            password: encryptedPassword.password,
                            iv: encryptedPassword.iv,
                            url: req.body.passwords.url
                        }
                    }
                },
                { upsert: true }
            );
        }

        res.status(201).send({ message: "Password added/updated successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

const validate = (data) => {
    const schema = Joi.object({
        userEmail: Joi.string().email().required().label("Email"),
        passwords: Joi.object({
            _id: Joi.string().optional(),
            title: Joi.string().required().label("Title"),
            username: Joi.string().required().label("Username"),
            password: Joi.string().required().label("Password"),
            url: Joi.string().optional().label("URL"),
        }).required().label("Passwords"),
    });
    return schema.validate(data);
};

module.exports = router;