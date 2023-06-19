const jwt = require("jsonwebtoken")

function isAuthenticated(req, res, next) {
    const { authorization } = req.headers;
  
    if (!authorization) {
      res.status(401).json({message: "Token not provided"})
      return
    }
  
    try {
      const token = authorization.split(' ')[1];
      console.log(token)
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.payload = payload;
      
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
          console.error(err.name);
        }
        res.status(401).json({message: "Unauthorized"})
        console.log(err)
        return
    }
  
    return next();
  }
  
  module.exports = {
      isAuthenticated
  }