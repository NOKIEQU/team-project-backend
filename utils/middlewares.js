const jwt = require("jsonwebtoken")
const { isBanned, isActivated, checkAdmin } = require('../services/manageUser');

async function isAuthenticated(req, res, next) {
    const { authorization } = req.headers;
  
    if (!authorization) {
      res.status(401).json({message: "Token not provided"})
      return
    }
  
    try {
      const token = authorization.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.payload = payload;

      const userId = req.payload.data.id 
      const banned = await isBanned(userId)

      if (banned) {
        res.status(401).json({message: "You are banned"})
        return
      }

      const activated = await isActivated(userId)

      if (!activated) {
        console.log(activated)
        res.status(401).json({message: "Your account is not activated"})
        return
      }
      
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
  
  async function isAdmin(req, res, next) {
    const { authorization } = req.headers;
  
    if (!authorization) {
      res.status(401).json({message: "Token not provided"})
      return
    }
  
    try {
      const token = authorization.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.payload = payload;

      const userId = req.payload.data.id 
      console.log(userId)
      const admin = await checkAdmin(userId)

      if (!admin) {
        res.status(403).json({message: "You are not an admin"})
        return
      }

      
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
      isAuthenticated,
      isAdmin
  }