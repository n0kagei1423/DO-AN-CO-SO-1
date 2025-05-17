const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

router.post("/", async (req, res) => {
    try {
        const { userEmail, oldPassword, newPassword } = req.body;
        if (!userEmail || !oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const complexityOptions = {
            min: 8,
            max: 30,
            lowerCase: 1,
            upperCase: 1,
            numeric: 1,
            symbol: 1,
            requirementCount: 4,
            messages: {
                "passwordComplexity.uppercase": "Password should contain at least 1 upper-cased letter",
                "passwordComplexity.lowercase": "Password should contain at least 1 lower-cased letter",
                "passwordComplexity.numeric": "Password should contain at least 1 number",
                "passwordComplexity.symbol": "Password should contain at least 1 symbol",
                "string.min": "Password should be at least {#min} characters long",
                "string.max": "Password should be at most {#max} characters long"
            }
        };

		const { error: passwordError } = passwordComplexity(complexityOptions).label("Password").validate(newPassword);
        if (passwordError) {
            return res.status(400).json({ message: passwordError.details[0].message });
        }


        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const validPassword = await bcrypt.compare(oldPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Old password is incorrect." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password changed successfully." });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server error." });
    }
});

module.exports = router;