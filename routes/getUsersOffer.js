const express = require('express')
const router = express.Router()
const { getUserOffers } = require('../services/manageOffers')

router.get('/', async (req, res) => {
    const { page, userId } = req.query

    const thePage = page || 1

    if (!userId) {
        res.status(400).json({message: "User not provided"})
    }

    try {

        const offers = await getUserOffers(thePage, process.env.LIMIT_PER_PAGE, userId)

        if (offers.data === []) {
            res.status(204).json({message: "User does not have any offers"})
            return
        }

        if (offers === "Server Error") {
            res.status(500).json({message: "Internal Server Error"})
            return
        }


        res.status(200).json({message: "Successfull", offers})


    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Internal Server Error"})
        return
    }

    
})

module.exports = router