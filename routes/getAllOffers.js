const express = require('express')
const router = express.Router()
const { getOffers } = require('../utils/manageOffers')

router.get('/', async (req, res) => {
    const { page } = req.query

    const thePage = page || 1


    try {

        const offers = await getOffers(thePage, 2)

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