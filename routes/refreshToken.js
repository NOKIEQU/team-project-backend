const express = require('express')
const {v4: uuidv4} = require('uuid')
const { generateTokens } = require("../utils/jwt")
const { addRefreshTokenToWhitelist, deleteRefreshToken, findRefreshTokenById } = require('../utils/auth')
const { getUserByID } = require('../services/getUsers')
const { hashToken } = require('../utils/hash')
const router = express.Router()

router.post('/', async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({message: 'Missing refresh token.'});
      }
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const savedRefreshToken = await findRefreshTokenById(payload.jti);
  
      if (!savedRefreshToken || savedRefreshToken.revoked === true) {
        res.status(401).json({message: "Unauthorized"})
      }
  
      const hashedToken = hashToken(refreshToken);
      if (hashedToken !== savedRefreshToken.hashedToken) {
        res.status(401).json({message: "Unauthorized"})
      }
  
      const user = await getUserByID(payload.userId);
      if (!user) {
        res.status(401).json({message: "Unauthorized"})
      }
  
      await deleteRefreshToken(savedRefreshToken.id);
      const jti = uuidv4();
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti);
      await addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, userId: user.id });
  
      res.json({
        accessToken,
        refreshToken: newRefreshToken
      });
    } catch (err) {
      next(err);
    }
  })

  module.exports = router