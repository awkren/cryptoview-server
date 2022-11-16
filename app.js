const bcrypt = require('bcrypt');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const dbConnect = require('./db/dbConnect');
const User = require('./db/userModel');

//execute db connection
dbConnect();

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

app.post('/register', (request, response) =>{
  //hash password
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) =>{
      //create new user instance + collect data
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      })

      //save new user
      user
        .save()
        //return success if new user is added to database
        .then((result) => {
          response.status(201).send({
            message: "User created successfully",
            result,
          })
        })
        //catch error if new user wasnt added successfully
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          })
        })
    })
    //catch error if password hash aint successful
    .catch((e) => {
      response.status(500).send({
        message: "Password hash wasnt successful",
        e,
      })
    })
})

module.exports = app;
