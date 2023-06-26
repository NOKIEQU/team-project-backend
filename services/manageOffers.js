const { db } = require('../utils/db')
const { getUserByID } = require('./getUsers')
const { addDays } = require('../utils/addDays')
const { Prisma } = require('@prisma/client')
const { createPaginator } = require('prisma-pagination') 
const { createDirectory, createFile } = require('../utils/fileSystem')

async function getOffers (page, perPage) {
    // get 20 offers and give a pagination
    // Sort it by the newest ones
    // delete expiration from each one of them

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
// TU KURWA
async function getUserOffers (page, perPage, userId) {
    try {
        const paginate = createPaginator({page: page, perPage: perPage})
        return await paginate(
            db.offers,
            {
                where: userId
            },
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
    // check if the user can post the offer aka. check for listings - done
    // decrease listings -1
    // save the images 
    // post the offer
    // Make sure the image pointers are in the database

    try {

        const user = await getUserByID(data.author)
        const date = new Date()
        const expiration = addDays(date, 30)
        const imagesArray = data.properties.images

        if (user === "User not Found") {
            return user
        }

        if (user.listings === 0) {
            return false
        }

       /*
       properties: {
        bedrooms: 4,
        rooms: 4,
        images: [
            "base64", 
            "base64", 
            "base64"
        ]
       }
       */

       async function appendImages (userId, offerId, base64Array) {

            const directory = `${userId}/${offerId}`

            try {

                await createDirectory(directory)

                const base64ImageArrayLength = base64Array.length

                for (let i = 0; i < base64ImageArrayLength; i++) {
                    const data = base64Array[i]

                    // use Sharp module to check if the image is in right format and size (format: jpg, size: 600x400) reject if not
                    // const buffer = Buffer.from(data, "base64"); // Dont need to do that since createFile() will transform it to an image anyway
                    
                    await createFile(data, i, directory)
                }

                const newImageArray = []
                

                for (let i = 0; i < base64ImageArrayLength; i++) {
                    newImageArray.push(`${process.env.APP_MEDIA_URL}/${userId}/${offerId}/${i}.jpg`)
                }

                const newProperties = data.properties 
                newProperties.images = newImageArray

                await db.offers.update({
                    where: {
                        id: offerId
                    },
                    data: {
                        properties: newProperties
                                  
                    }
                })

            } catch (err) {
                console.error(err)
                return
            }


            // Update the record with the url to the images
       }


        try {

            delete data.properties.images
             var finalOffer = await db.offers.create({
                data: {
                    author: data.author,   
                    authorName: data.authorName,    
                    title: data.title,         
                    description: data.description,  
                    price: data.price, 
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
        

        await appendImages(data.author, finalOffer.id, imagesArray)

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
    getUserOffers,
    postOffer,
    postBoostedOffer,
    postBoostedMainOffer,
}
