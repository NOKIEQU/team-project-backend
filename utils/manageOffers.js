const { db } = require('./db')
const { getUserByID } = require('./getUsers')
const { addDays } = require('./addDays')
const { Prisma } = require('@prisma/client')

async function getOffers () {

}

async function getOfferByID (offerID) {
    return await db.offers.findUnique({
        where: {
            id: offerID
        }
    })
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

        try {

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

        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2000') {
                    return err
                }
                return "Server Error"
            }
        }

       

        await db.user.update({
            where: {
                id: data.author
            },
            data: {
                listings: user.listings - 1
            }
        })

        return true

    } catch (err) {
        console.error(err)
        return "Server Error"
    }

}

async function postBoostedOffer (userId, offerId) {

    const user = await getUserByID(userId)
    const date = new Date()
    const expiration = addDays(date, 15)

    try {

        if (user.bids === 0) {
            return false
        }

        const offer = await getOfferByID(offerId)

        offer.isBoosted = true 
        offer.expires = expiration

        await db.BoostedOffers.create({
            data: offer
        })

        await db.user.update({
            where: {
                id: userId
            },
            data: {
                bids: user.bids - 1
            }
        })
        
        return true

    } catch (err) {
        return "Server Error"
    }
}

async function postBoostedMainOffer (userId, offerId) {
    const user = await getUserByID(userId)
    const date = new Date()
    const expiration = addDays(date, 7)

    try {

        if (user.bids === 0) {
            return false
        }

        const offer = await getOfferByID(offerId)

        offer.isBoosted = true 
        offer.expires = expiration

        await db.MainBoostedOffers.create({
            data: offer
        })

        await db.user.update({
            where: {
                id: userId
            },
            data: {
                bids: user.bids - 1
            }
        })
        
        return true

    } catch (err) {
        return "Server Error"
    }
}

module.exports = {
    getOffers,
    postOffer,
    postBoostedOffer,
    postBoostedMainOffer
}
