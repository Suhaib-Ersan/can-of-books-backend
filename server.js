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
mongoose.connect("mongodb://localhost:27017/books", { useNewUrlParser: true, useUnifiedTopology: true });
server.use(express.json());

const BookSchema = new mongoose.Schema({
  bookName: String,
  author: String,
  description: String,
  cover: String,
  status: String,
  userNotes: String,
  year: String,
});

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  books: [BookSchema],
});

const myUserModel = mongoose.model("User", UserSchema);
const myBooksModel = mongoose.model("Book", BookSchema);

function seedUserCollection() {
  const suhaib = new myUserModel({
    firstName: "suhaib",
    lastName: "ersan",
    email: "suhaib.m.ersan@gmail.com",
    books: [
      { bookName: "The Design of Everyday Things: Revised and Expanded Edition", author: "Don Norman", description: "The Design of Everyday Things shows that good, usable design is possible. The rules are simple: make things visible, exploit natural relationships that couple function and control, and make intelligent use of constraints. The goal: guide the user effortlessly to the right action on the right control at the right time.", cover: "https://i.imgur.com/u694Jd4.png", status: "finished", userNotes: "pretty good book, need a re-read", year: "2013" },
      { bookName: "Minhaj as-Sunnah an-Nabawiyyah", author: "Ibn Taymiyyah", description: "It was written as a refutation of a book by the Shi'a-Ithna'ashari theologian Al-Hilli called Minhaj al-karamah.", cover: "https://i.imgur.com/4jkbioT.png", status: "on read list", userNotes: "a book i want to read", year: "12-13th century" },
      { bookName: "Thinking with Type, A Critical Guide for Designers, Writers, Editors, & Students", author: "Ellen Lupton ", description: "he best-selling Thinking with Type in a revised and expanded second edition:Thinking with Type is the definitive guide to using typography in visual communication. Ellen Lupton provides clear and focused guidance on how letters, words, and paragraphs should be aligned, spaced, ordered, and shaped. The book covers all typography essentials, from typefaces and type families, to kerning and tracking, to using a grid. Visual examples show how to be inventive within systems of typographic form, including what the rules are, and how to break them.", cover: "https://i.imgur.com/7ouSVB6.png", status: "on backlog", userNotes: "", year: "2004" },
    ],
  });

  suhaib.save();
}
// seedUserCollection();

// http://localhost:3001/books?email=suhaib.m.ersan@gmail.com
server.get("/books", getUserData);
function getUserData(req, res) {
  let email = req.query.email;

  myUserModel.find({ email: email }, function (error, userData) {
    if (error) {
      res.send("did not work");
    } else {
      console.log("userData here vvvvvvvvvvvvvvvvvvvvvvvvv");
      console.log(userData);
      res.send(userData[0].books);
    }
  });
}

// http://localhost:3001/addbook?{object}
server.post("/addbook", addBookHandler);
function addBookHandler(req, res) {
  let { email, bookName, publishYear, description, author, coverUrl } = req.body;

  myUserModel.find({ email: email }, function (error, userData) {
    if (error) {
      res.send("did not work");
    } else {
      console.log("userData here vvvvvvvvvvvvvvvvvvvvvvvvv");
      console.log("before adding", userData);

      userData[0].books.push({
        bookName,
        year: publishYear,
        description,
        author,
        cover: coverUrl,
      });
      console.log("after adding", userData[0]);
      userData[0].save();
      res.send(userData[0].books);
    }
  });
}

server.delete("/deletebook/:indexid", deleteBookHandler);
function deleteBookHandler(req, res) {
  console.log(req.params);
  console.log(req.query);
  let index = Number(req.params.indexid);
  console.log({ index });
  let email = req.query.email;
  myUserModel.find({ email: email }, (error, userData) => {
    if (error) {
      res.send("cant find user");
    } else {
      let newBooksArr = userData[0].books.filter((book, idx) => {
        if (idx !== index) {
          return book;
        }
      });
      userData[0].books = newBooksArr;
      userData[0].save();
      res.send(userData[0].books);
    }
  });
}

server.get("/test", (req, res) => {
  res.status(200).send("server received request on /test");
});

server.get("/*", (req, res) => {
  res.status(404).send("404: not found");
});

server.listen(PORT, () => console.log(`listening on ${PORT}`));
