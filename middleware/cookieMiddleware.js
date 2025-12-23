const cookieParser = require("cookie-parser");

const express = require("express");

const app = express();

app.use(cookieParser());
const jwt = require("jsonwebtoken");


const cookieMiddleware = async (req, res, next) => {
  try {
    if (req.cookies) {
      // console.log("cookie", req.cookies)
      // console.log("session", req.cookies.session)
      req.user = jwt.verify(
        req.cookies.session,
        process.env.ACCESS_TOKEN_SECRET
      );
      console.log(req.user);
   
    
    
    
      next();

    } else return res.status(403).json({ message: "Resource forbidden!" });
  } catch (err) {
    console.log(err);
   return res.status(401).json({ message: "Resource forbidden!" });
  }

};

module.exports = cookieMiddleware;
