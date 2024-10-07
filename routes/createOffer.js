const express = require('express')
const router = express.Router()
const { postOffer } = require('../services/manageOffers')
const { getUserByID } = require('../services/getUsers')
const { isImage } = require('../utils/isImage')
const { checkAdmin } = require('../services/manageUser')

router.post('/', async (req, res) => {
    const { data } = req.body

    if (!data) {
        res.status(400).json({ message: "Data must be provided" })
        return
    }

    try {

        if (!data.author || !data.title || !data.description || !data.price) {
            res.status(400).json({ message: "Missing Values" })
            return
        }

        if (!Number.isInteger(data.price)) {
            res.status(400).json({ message: "The price must be a number" })
        }

        if (data.author === "" || data.title === "" || data.description === "" || data.price === 0) {
            res.status(400).json({ message: "Values cannot be empty" })
            return
        }

        try {

            // await getUserByID(data.author)
            await checkAdmin(data.author) //

        } catch (err) {
            res.status(400).json({ message: "User must be an admin" })
        }

        const createOffer = await postOffer(data)

        if (createOffer === false) {
            res.status(403).json({ message: "User does not have enough funds" })
            return
        }

        if (createOffer === "Server Error") {
            res.status(500).json({ message: "Could not create offer" })
            return
        }

        if (createOffer.code === "P2000" && createOffer.meta.column_name === 'title') {
            res.status(400).json({ message: "The title is too big" })
            return
        }

        if (createOffer.code === "P2000" && createOffer.meta.column_name === 'description') {
            res.status(400).json({ message: "The description is too big" })
            return
        }

        // We dont need to check that because user info is in the token and he cant edit it
        // However he might use api endpoint to overwrite that I Guess

        // if (createOffer === "Username does not not exist with this ID") {
        //     res.status(400).json({message: "Username does not not exist with this ID"})
        //     return
        // }

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