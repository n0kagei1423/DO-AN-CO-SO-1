const express = require('express');
const mysql = require("mysql")
const dotenv = require('dotenv')

var app = express();

dotenv.config({ path: './database/.env' })

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	port: process.env.DATABASE_PORT,
})

db.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL connected!")
    }
})

app.set('view engine', 'html')

app.engine('html', require('ejs').renderFile);


const path = require("path")


app.use(express.static(path.join(__dirname, '/views')));

app.get("/", (req, res) => {
    res.render("login")
})

app.listen(5000, ()=> {
    console.log("server started on port 5000")
})