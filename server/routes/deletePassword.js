const router = require('express').Router();
const { Passwords } = require('../models/passwords');
const Joi = require("joi");

// Delete multiple passwords for a user
router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const { userEmail, passwords } = req.body;

        // Remove each password by title (and optionally username/url for more precision)
        const update = {
            $pull: {
                passwords: {
                    $or: passwords.map(pw => ({
                        title: pw.title,
                        username: pw.username,
                        url: pw.url
                    }))
                }
            }
        };

        const result = await Passwords.findOneAndUpdate(
            { userEmail },
            update,
            { new: true }
        );

        if (!result) {
            return res.status(404).send({ message: "No passwords found for this user." });
        }

        res.status(200).send({ message: "Selected passwords deleted successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

const validate = (data) => {
    const schema = Joi.object({
        userEmail: Joi.string().email().required(),
        passwords: Joi.array().items(
            Joi.object({
                title: Joi.string().required(),
                username: Joi.string().required(),
                url: Joi.string().optional()
            })
        ).min(1).required()
    });
    return schema.validate(data);
};

module.exports = router;