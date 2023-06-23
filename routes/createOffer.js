const express = require('express')
const router = express.Router()
const { postOffer } = require('../utils/manageOffers')
const { getUserByID } = require('../utils/getUsers')

router.post('/', async (req, res) => {
    const { data } = req.body

    if (!data || data === {}) {
        res.status(400).json({message: "Data must be provided"})
        return
    }
   
    try {

        
       
        if (!data.author || !data.authorName || !data.title || !data.description || !data.region || !data.type || !data.sellType || !data.city || !data.properties) {
            res.status(400).json({message: "Missing Values"})
            return
        }

        if (data.author === "" || data.authorName === "" || data.title === "" || data.description === "" || data.region === "" || data.type === "" || data.sellType === "" || data.city === "") {
            res.status(400).json({message: "Values cannot be empty"})
            return 
        }

        if (data.properties === {}) {
            res.status(400).json({message: "You must provide properties"})
            return
        }

        // You must only allow following in the properties object:
        // bedrooms
        // rooms
        // images (Array)
        // ...
        // Anything else, reject

        const neededKeys = ['bedrooms', 'rooms'];

        const obj = data.properties


        if (!neededKeys.every(key => Object.keys(obj).includes(key))) {
            res.status(400).json({message: "Properties keys are invalid"})
            return
        }

        if (data.properties.bedrooms === null|| data.properties.rooms === null) {
            res.status(400).json({message: "Missing Properties Values"})
            return
        }

        if (!Number.isInteger(data.properties.bedrooms) || !Number.isInteger(data.properties.rooms)) {
            res.status(400).json({message: "Properties values for the offer must be an Integer"})
            return
        }

            try {

                await getUserByID(data.author)

            } catch (err) {
                res.status(400).json({message: "User does not exist"})
            }


        const createOffer = await postOffer(data)

        if (createOffer === false) {
            res.status(403).json({message: "User does not have enough funds"})
            return
        }

        if (createOffer === "Server Error") {
            res.status(500).json({message: "Could not create offer"})
            return
        }

        if (createOffer.code === "P2000" && createOffer.meta.column_name === 'title') {
            res.status(400).json({message: "The title is too big"})
            return
        }

        if (createOffer.code === "P2000" && createOffer.meta.column_name === 'description') {
            res.status(400).json({message: "The description is too big"})
            return
        }

        // if (createOffer === "Username does not not exist with this ID") {
        //     res.status(400).json({message: "Username does not not exist with this ID"})
        //     return
        // }

        if (createOffer === true) {
            res.status(200).json({message: "Successfull", data: data})
        }

        

    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Internal Server Error"})
        return
    }

    
})

module.exports = router