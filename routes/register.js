const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const express = require('express');
const {v4: uuidv4} = require('uuid')
const { generateTokens } = require("../utils/jwt")
const { addRefreshTokenToWhitelist } = require('../utils/auth')
const { createUser } = require("../services/createUser")
const { sendMail } = require('../utils/mail')

const router = express.Router()

router.post('/', async (req, res) => {

    try {
        
        const { username, email, password, confirmPassword } = req.body

        let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

        if (!emailRegex.test(email)) {
            res.status(400).json({message: "Invalid Email"})
            return
        }

        const checkUser = !!await prisma.user.findFirst({
                where: {
                    username: username
                }
        })

        const checkEmail = !!await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if (checkUser) {
            res.status(400).json({message: "Username already exists."})
            return
        }

        if (username > 20) {
            res.status(400).json({message: "Username cannot have more than 20 characters."})
            return
        }
        
        if (checkEmail) {
            res.status(400).json({message: "Email already exists."})
            return
        }

        if (password !== confirmPassword) {
            res.status(400).json({message: "Passwords must match"})
            return
        }

        if (!username || username.lenght === 0) {
            res.status(400).json({message: "Username cannot be empty"})
            return
        }

        const newUser = await createUser({username, email, password})

        const jti = uuidv4();
        const { accessToken, refreshToken } = generateTokens(newUser, jti)

        await addRefreshTokenToWhitelist({ jti, refreshToken, userId: newUser.id })
        await sendMail(newUser.email)

        res.status(200).json({message: "User created successfully", token: accessToken, refresh: refreshToken})

    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Internal Server Error!"})
    }

})

module.exports = router