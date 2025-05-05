const express = require("express");

const Router = express.Router();
const { register, login } = require("../controllers/auth.controller.js");


//register a new user
Router.post("/register", register);

//login a user
Router.post("/login", login)

module.exports = Router;