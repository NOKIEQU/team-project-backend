
const express = require('express')
const {v4: uuidv4} = require('uuid')
const { generateTokens } = require("../utils/jwt")
const { addRefreshTokenToWhitelist } = require('../utils/auth')
const { GetUserByEmail } = require('./getUsers')
const bcrypt = require('bcrypt')
const router = express.Router()


router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).json({message: "You must provide login credentials"});
            return
        }

        const existingUser = await GetUserByEmail(email);

        if (!existingUser) {
            res.status(403).json({message: "Invalid login credentialsss"})
            return
        }

        const validPassword = await bcrypt.compare(password, existingUser.password);

        if (!validPassword) {
            res.status(403).json({message: "Invalid login credentials"})
            return
        }

        const jti = uuidv4();
        const { accessToken, refreshToken } = generateTokens(existingUser, jti);
        await addRefreshTokenToWhitelist({ jti, refreshToken, userId: existingUser.id })
        delete existingUser.password
        res.status(200).json({message: "Successfull", token: accessToken, refresh: refreshToken, user: existingUser})

    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Internal Server Error"})
    }
})

module.exports = router