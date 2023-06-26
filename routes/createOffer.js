const express = require('express')
const router = express.Router()
const { postOffer } = require('../services/manageOffers')
const { getUserByID } = require('../services/getUsers')
const { isImage } = require('../utils/isImage')

router.post('/', async (req, res) => {
    const { data } = req.body

    if (!data || data === {}) {
        res.status(400).json({message: "Data must be provided"})
        return
    }
   
    try {
        
        if (!data.author || !data.authorName || !data.title || !data.description || !data.price || !data.region || !data.type || !data.sellType || !data.city || !data.properties) {
            res.status(400).json({message: "Missing Values"})
            return
        }

        if (!Number.isInteger(data.price)) {
            res.status(400).json({message: "The price must be a number"})
        }

        if (data.author === "" || data.authorName === "" || data.title === "" || data.description === "" || data.price === 0 || data.region === "" || data.type === "" || data.sellType === "" || data.city === "") {
            res.status(400).json({message: "Values cannot be empty"})
            return 
        }

        if (data.properties === {}) {
            res.status(400).json({message: "You must provide properties"})
            return
        }

        // You must only allow following in the properties object:
        // Probably we need to have a list per type
        // bedrooms
        // rooms
        // area
        // ...
        // images (Array)
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

        // Check if the image array isnt empty (must be at least 3 and maximum of 20)
        if (data.properties.images.length === 0) {
            res.status(400).json({message: "You must provide at least 3 images"})
        }

        if (data.properties.images.length < 1) {
            res.status(400).json({message: "You must provide at least 3 images"})
        }

        if (data.properties.images.length > 20) {
            res.status(400).json({message: "You must provide less than 20 images"})
        }


        // Check if it's valid base64 String - done
        // Check if it's valid base64 Image - WiP
        // UPDATE: Still not safe

        // This will prevent user from sending empty string and base64 that does not have the image header

        const base64ImageArray = data.properties.images
        const base64ImageArrayLength = base64ImageArray.length

        for (let i = 0; i < base64ImageArrayLength; i++) {
            
            if (base64ImageArray[i] === "") {
                res.status(400).json({message: "Image cannot be empty"})
            }
            
            const image = await isImage(base64ImageArray[i])

            if (!image) {
                res.status(400).json({message: "Image is invalid"})
                break
                
            }
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

        // We dont need to check that because user info is in the token and he cant edit it
        // However he might use api endpoint to overwrite that I Guess

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