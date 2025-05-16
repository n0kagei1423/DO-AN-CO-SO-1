const router = require('express').Router();
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
const Joi = require("joi");
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
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.passwords.password, salt);

        const result = await Passwords.findOneAndUpdate(
            {
                userEmail: req.body.userEmail,
                "passwords.title": req.body.passwords.title
            },
            {
                $set: {
                    "passwords.$.username": req.body.passwords.username,
                    "passwords.$.password": hashPassword,
                    "passwords.$.url": req.body.passwords.url
                }
            },
            { new: true }
        );

        if (!result) {
            await Passwords.findOneAndUpdate(
                { userEmail: req.body.userEmail },
                {
                    $push: {
                        passwords: {
                            title: req.body.passwords.title,
                            username: req.body.passwords.username,
                            password: hashPassword,
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
            title: Joi.string().required().label("Title"),
            username: Joi.string().required().label("Username"),
            password: Joi.string().required().label("Password"),
            url: Joi.string().optional().label("URL"),
        }).required().label("Passwords"),
    });
    return schema.validate(data);
};

module.exports = router;