const express = require('express');
const mysql = require("mysql")
const dotenv = require('dotenv')
const cors = require('cors')
const connection = require('./db')
const authRoutes = require('./routes/auth')
const usersRoutes = require('./routes/users')
const addPasswordRoutes = require('./routes/addPassword')


connection()
var app = express();

app.use(express.json());
app.use(cors())

app.use("/api/auth", authRoutes)
app.use("/api/users", usersRoutes)
app.use("/api/addPassword", addPasswordRoutes)

app.listen(5000, ()=> {
    console.log("server started on port 5000")
})