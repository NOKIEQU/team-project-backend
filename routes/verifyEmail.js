const express = require('express')
const router = express.Router()
const { verifyEmailCode } = require('../utils/mail')


router.get('/', async (req, res) => {
    const { code, email } = req.query

    if (!code || !email) {
        res.status(400).json({message: "You must provide valid values"})
    }

    try {

        const isRequestValid = await verifyEmailCode({code, email})

        if (!isRequestValid) {
            res.status(400).json({message: "Provided values are incorrect"})
            return
        }

        // Since is valid we can delete the code

        res.status(200).json({message: "Email verified successfully"})

    } catch(err) {
        console.error(err)
        res.status(500).json({message: "Internal Server Error"})
    }
})

module.exports = router