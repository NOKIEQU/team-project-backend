const express = require('express')
const router = express.Router()
const { getOfferByID } = require('../services/manageOffers')

router.get('/', async (req, res) => {
    const { page, offerID } = req.query

    const thePage = page || 1

    if (!offerID) {
        res.status(400).json({message: "Offer not provided"})
    }

    try {

        const offer = await getOfferByID(thePage, process.env.LIMIT_PER_PAGE, offerID)


        if (offer === "Server Error") {
            res.status(500).json({message: "Internal Server Error"})
            return
        }

        if (offer === "Offer not found") {
            res.status(400).json({message: "Offer was not found"})
        }

        res.status(200).json({message: "Successfull", offer})


    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Internal Server Error"})
        return
    }

    
})

module.exports = router