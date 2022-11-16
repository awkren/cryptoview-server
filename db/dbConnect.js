// imports
const mongoose = require('mongoose');
require('dotenv').config({path: '.env'});

async function dbConnect(){
  // using mongoose to connect to the database on mongoDB using DB_URL -- connection string
  mongoose
    .connect(
      process.env.DB_URL,
      {
        //to ensure connection is done properly
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
      }
    )
    //checking to see if connection was successful or not
    .then(() => {
      console.log(" you've got this! Connection ok!!");
    })
    .catch((error) => {
      console.log('Couldnt connect to Atlas');
      console.error(error)
    })
}

module.exports = dbConnect;