
const cookieParser =  require("cookie-parser")

const express = require("express")

const app = express()

app.use(cookieParser())






const cookieMiddleware = (req, res, next) => {
  // const sessionId = req.cookie.session
  console.log(req.cookies)

  

  // if (!sessionId) {
  //   console.log("User not logged in")
  //   res.status(401).json({message: "User not logged in"})
  // }

  // console.log(sessionId)

  // req.user =  getUserFromSession(sessionId)



  next()






};

module.exports = cookieMiddleware