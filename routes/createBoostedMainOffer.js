const express = require('express')
const router = express.Router()
const { postBoostedMainOffer } = require('../services/manageOffers')

router.post('/', async (req, res) => {
    const { userId, offerId } = req.body

    try {

        if (!userId) {
            res.status(400).json({message: "User must be providedd"})
            return
        }

        if (!offerId) {
            res.status(400).json({message: "Offer must be provided"})
            return
        }

        const offer = await postBoostedMainOffer(userId, offerId)

        if (offer === false) {
            res.status(403).json({message: "User does not have enough funds"})
            return
        }

        if (offer === "User not Found") {
            res.status(400).json({message: "User does not exist"})
            return
        }

        if (offer === "Offer not found") {
            res.status(400).json({message: "Offer does not exist"})
            return
        }
        
        if (offer === true) {
            res.status(200).json({message: "Successfull", data: offer})
        }

    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Internal Server Error"})
        return
    }

    
})

module.exports = router