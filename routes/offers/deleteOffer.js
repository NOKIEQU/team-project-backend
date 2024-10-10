const express = require('express')
const router = express.Router()
const { deleteOffer } = require('../services/manageOffers')

router.delete('/:id', async (req, res) => {
    const { id } = req.params

    if (!id) {
        res.status(400).json({ message: "ID must be provided" })
        return
    }

    try {

        const deleteOff = await deleteOffer(id)

        if (deleteOff === "Offer not found") {
            res.status(404).json({ message: "Offer not found" })
            return
        }

        res.status(200).json({ message: "Offer deleted" })

    } catch (err) {
        res.status(500).json({ message: "Server Error" })
    }

}
)

module.exports = router