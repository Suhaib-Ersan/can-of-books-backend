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


server.get('/test', (req, res) => {
  res.status(200).send('server received request on /test')
})




server.get('/*', (req, res) => {
  res.status(404).send('404: not found')
})

server.listen(PORT, () => console.log(`listening on ${PORT}`));
