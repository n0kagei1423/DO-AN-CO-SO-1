const express = require('express');
const mysql = require("mysql")
const dotenv = require('dotenv')
const cors = require('cors')
const connection = require('./db')
const authRoutes = require('./routes/auth')
const usersRoutes = require('./routes/users')
const addPasswordRoutes = require('./routes/addPassword')
const showPasswordRoutes = require('./routes/showPassword')
const deletePasswordRoutes = require('./routes/deletePassword')
const changePasswordRoute = require("./routes/changePassword");

connection()
var app = express();

app.use(express.json());
app.use(cors())

app.use("/api/auth", authRoutes)
app.use("/api/users", usersRoutes)
app.use("/api/addPassword", addPasswordRoutes)
app.use("/api/showPassword", showPasswordRoutes)
app.use("/api/deletePassword", deletePasswordRoutes)
app.use("/api/changePassword", changePasswordRoute);

app.listen(5000, ()=> {
    console.log("server started on port 5000")
})