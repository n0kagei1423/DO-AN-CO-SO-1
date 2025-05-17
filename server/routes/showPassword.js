const router = require('express').Router();
const { User } = require('../models/user');
const { encrypt, decrypt } = require("../utils/crypto/EncryptionHandler")
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

        // Find all passwords for the user
        const passwordsDoc = await Passwords.findOne({ userEmail: req.body.userEmail });
        if (!passwordsDoc || !passwordsDoc.passwords || passwordsDoc.passwords.length === 0) {
            return res.status(404).send({ message: 'No passwords found for this user' });
        }

        const decryptedPasswords = passwordsDoc.passwords.map(item => ({
            _id: item._id,
            title: item.title,
            username: item.username,
            url: item.url,
            password: (item.password && item.iv) ? decrypt(item.password, item.iv) : ""
        }));
        res.status(200).send({ passwords: decryptedPasswords });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

const validate = (data) => {
    const schema = Joi.object({
        userEmail: Joi.string().email().required().label("Email"),
    });
    return schema.validate(data);
};

module.exports = router;