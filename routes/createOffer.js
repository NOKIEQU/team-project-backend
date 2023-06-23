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
    // data: {
    //     author: data.author,       
    //     title: data.title,         
    //     description: data.description,   
    //     region: data.region,       
    //     type: data.type,            
    //     city: data.city,         
    //     isBoosted: false,    
    //     properties: data.properties,         
    //     expires: expiration     
    // }

    try {

        
       
        if (!data.author || !data.title || !data.description || !data.region || !data.type || !data.city || !data.properties) {
            res.status(400).json({message: "Missing Values"})
            return
        }

        if (data.author === "" || data.title === "" || data.description === "" || data.region === "" || data.type === "" || data.city === "") {
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

        if (data.properties.bedrooms === null|| data.properties.rooms === null) {
            console.log(data.properties.bedrooms, data.properties.rooms)
            res.status(400).json({message: "Missing Properties Values"})
            return
        }

        if (!Number.isInteger(data.properties.bedrooms) || !Number.isInteger(data.properties.rooms)) {
            res.status(400).json({message: "Properties values for the offer must be an Integer"})
            return
        }


            try {
                const user = await getUserByID(data.author)
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