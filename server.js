"use strict";

require("dotenv").config();
const express = require("express");
const server = express();
const cors = require("cors");
server.use(cors());
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const PORT = process.env.PORT || 3001;
const axios = require("axios");
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/favoritebooks', { useNewUrlParser: true, useUnifiedTopology: true });



const kittySchema = new mongoose.Schema({
  name: String,
  breed: String
});





server.get('/test', (req, res) => {
  res.status(200).send('server received request on /test')
})


server.get("/test", (req, res) => {
  // TODO:
  // STEP 1: get the jwt from the headers
  // STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
  // jsonwebtoken dock - https://www.npmjs.com/package/jsonwebtoken
  // STEP 3: to prove that everything is working correctly, send the opened jwt back to the front-end
});


server.listen(PORT, () => console.log(`listening on ${PORT}`));
