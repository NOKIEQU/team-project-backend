const { db } = require('../utils/db')
const { Prisma } = require('@prisma/client')
const { createPaginator } = require('prisma-pagination') 

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
    

    try {

        try {

             var finalOffer = await db.offers.create({
                data: {
                    author: data.author,   
                    title: data.title,         
                    description: data.description,  
                    price: data.price, 
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

        return true

    } catch (err) {
        console.error(err)
        return "Server Error"
    }

}


module.exports = {
    getOffers,
    getOfferByID,
    postOffer
}
