const express = require('express')
const router = express.Router()
const { postOffer } = require('../../services/manageOffers')
const { getCategoryByID } = require('../../services/manageCategories')

router.post('/', async (req, res) => {
    const data = req.body

    if (!data) {
        res.status(400).json({ message: "Data must be provided" })
        return
    }

    try {

        if (!data.title || !data.description || !data.price || !data.category_id) {
            res.status(400).json({ message: "Missing Values" })
            return
        }

        if (!Number.isInteger(data.price)) {
            res.status(400).json({ message: "The price must be a number" })
        }

        if (data.title === "" || data.description === "" || data.price === 0) {
            res.status(400).json({ message: "Values cannot be empty" })
            return
        }

        try {
            const category = await getCategoryByID(data.category_id)

            if (category === "Category not found") {
                res.status(404).json({ message: "Category not found" })
                return
            }

        } catch (err) { console.error(err) }

        const createOffer = await postOffer(data)


        if (createOffer === "Server Error") {
            res.status(500).json({ message: "Could not create offer" })
            return
        }

       

        if (createOffer === true) {
            res.status(200).json({ message: "Successfull", data: data })
        }

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server Error" })
        return
    }


})

module.exports = router