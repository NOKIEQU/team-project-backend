const express = require('express')
const router = express.Router()
const { editOffer } = require('../../services/manageOffers')

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const data = req.body

    if (!id) {
        res.status(400).json({ message: "ID must be provided" })
        return
    }

    if (!data) {
        res.status(400).json({ message: "Data must be provided" })
        return
    }
 
    try {

        if (!data.name || !data.description || !data.price || !data.category_id || !data.image) {
            res.status(400).json({ message: "Missing Values" })
            return
        }

        if (data.name === "" || data.description === "" || data.price === "" || data.category_id === "" || data.image === "") {
            res.status(400).json({ message: "Values cannot be empty" })
            return
        }

        

        const editOff = await editOffer(id, data)

        if (editOff === "Offer not found") {
            res.status(404).json({ message: "Offer not found" })
            return
        }

        res.status(200).json({ message: "Offer edited" })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }

}
)

module.exports = router