const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './database/.env'});

module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    try {
        mongoose.connect(process.env.DB, connectionParams);
        console.log("Connected to database");
    }
    catch (error) {
        console.log("Could not connect to database", error);
    }
}