const { db } = require('../utils/db')
const { getUserByID } = require('./getUsers')
const { addDays } = require('../utils/addDays')

async function getOffers () {

}

async function postOffer (data) {
    // check if the user can post the offer aka. check for listings
    // decrease listings -1
    // Post the images into s3
    // Make sure the image pointers are ready to put into the database
    // post the offer

    try {

        const user = await getUserByID(data.author)
        const date = new Date()
        const expiration = addDays(date, 30)

        
        if (user.listings === 0) {
            return false
        }

        await db.offers.create({
            data: {
                author: data.author,       
                title: data.title,         
                description: data.description,   
                region: data.region,       
                type: data.type,            
                city: data.city,         
                isBoosted: false,    
                properties: data.properties,         
                expires: expiration     
            }
        })

        await db.user.update({
            where: {
                id: data.author
            },
            data: {
                listings: user.listings - 1
            }
        })

    } catch (err) {
        console.error(err)
        return "Server Error"
    }

}

async function postBoostedOffer (id) {

    const user = await getUserByID(id)
    const date = new Date()
    const expiration = addDays(date, 15)

    try {

        
        

    } catch (err) {
        return "Server Error"
    }
}

module.exports = {
    getOffers,
    postOffer,
    postBoostedOffer
}
