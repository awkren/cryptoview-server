const jwt = require("jsonwebtoken");

module.exports = async (request, response, next) => {
  try{
    // get token from authorization header
    const token = await request.headers.authorization.split(" ")[1];
    // check if token matches the supposed origin
    const decodedToken = await jwt.verify(
      token,
      "RANDOM-TOKEN"
    )
    // retrieve user details of the logged in user
    const user = await decodedToken;
    //pass user down to the endpoints here
    request.user = user;
    // pass down funcionality to the endpoint
    next();
  } catch (error){
    response.status(401).json({
      error: new Error("Invalid request!"),
    })
  }
}