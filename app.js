const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const dbConnect = require('./db/dbConnect');
const User = require('./db/userModel');
const auth = require('./auth')
const cors = require('cors');

//execute db connection
dbConnect();

//curb cors error by adding a header here
app.use(cors({
    origin: '*', // use your actual domain name (or localhost), using * is not recommended
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true
}))

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "You've got this! Server is running, fam" });
  next();
});

//register endpoint
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

//login endpoint
app.post('/login', (request, response) => {
  //check if email exists
  User.findOne({email: request.body.email})
    //if email exists
    .then((user) => {
      //compare the password the user entered with the hashed password
      bcrypt.compare(request.body.password, user.password)
        //if password matches
        .then((passwordCheck) => {
          //check if password matches
          if(!passwordCheck){
            return response.status(400).send({
              message: "Password does not match",
              error,
            })
          }
        
        //create jwt token
        const token = jwt.sign(
          {
            userId: user._id,
            userEmail: user.email,
          },
          "RANDOM-TOKEN",
          { expiresIn: "24h" }
        )

        //return success response
        response.status(200).send({
          message: "Login Successful",
          email: user.email,
          token,
        })

        })
        //catch error if password doesnt match
        .catch((error) => {
          response.status(400).send({
            message: "Password does not match",
            error,
          })
        })
    })
    //catch error if email doesnt exist
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      })
    })
})

//free endpoint
app.get('/free-endpoint', (request, response) => {
  response.json({ message: "You are allowed to access mt at anytime"})
})
//authentication endpoint
app.get('/auth-endpoint', auth, (request, response) => {
  response.json({ message: "You are authorized to access me now!"})
})

module.exports = app;
