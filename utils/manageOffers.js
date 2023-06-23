const { db } = require('./db')
const { getUserByID } = require('./getUsers')
const { addDays } = require('./addDays')
const { Prisma } = require('@prisma/client')
const { createPaginator } = require('prisma-pagination') 

async function getOffers (page, perPage) {
    // get 20 offers and give a pagination
    // Sort it by the newest ones
    // delete expiration from each one of them or select everything but expiration

    try {
        const paginate = createPaginator({page: page, perPage: perPage})
        return await paginate(
            db.offers,
            {
                select: {
                    id: true,
                    author: true,
                    title: true,
                    description: true,
                    region: true,
                    type: true,
                    city: true,
                    isBoosted: true,
                    properties: true,
                    expires: false,
                    createdAt: true,
                    updatedAt: true,
                }
            }
        )

    } catch (err) {
        console.log(err)
        return "Server Error"
    }
}

async function getUserOffers () {
    
}

async function getOfferByID (offerID) {

    try {

        return await db.offers.findUnique({
            where: {
                id: offerID
            }
        })

    } catch (err) {
        return "Offer not found"   
    }

  
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

        if (user === "User not Found") {
            return user
        }

        if (user.listings === 0) {
            return false
        }

        // try {
        //     // There is probably better way of doing this but for now i'll leave it like this
        //     await db.user.findUnique({
        //         where: {
        //             username: data.authorName
        //         }
        //     })

        // } catch (err) {
        //     console.error(err)
        //     return "Username does not not exist with this ID"
        // }

        try {
            await db.offers.create({
                data: {
                    author: data.author,   
                    authorName: data.authorName,    
                    title: data.title,         
                    description: data.description,   
                    region: data.region,       
                    type: data.type, 
                    sellType: data.sellType,           
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

    const date = new Date()
    const expiration = addDays(date, 15)

    try {

        const user = await getUserByID(userId)

        if (user === "User not Found") {
            return user
        }

        if (user.bids === 0) {
            return false
        }

        const offer = await getOfferByID(offerId)

        if (offer === "Offer not found") {
            return offer
        }

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
    const date = new Date()
    const expiration = addDays(date, 7)

    try {

        const user = await getUserByID(userId)

        if (user === "User not Found") {
            return user
        }

        if (user.bids === 0) {
            return false
        }

        const offer = await getOfferByID(offerId)

        if (offer === "Offer not found") {
            return offer
        }

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
                premiumBids: user.premiumBids - 1
            }
        })
        
        return true

    } catch (err) {
        return "Server Error"
    }
}

module.exports = {
    getOffers,
    getOfferByID,
    postOffer,
    postBoostedOffer,
    postBoostedMainOffer
}
