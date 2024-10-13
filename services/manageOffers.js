const { db } = require('../utils/db')
const { createPaginator } = require('prisma-pagination')
async function getOffers(page, perPage) {
    // get 20 offers and give a pagination
    // Sort it by the newest ones
    // delete expiration from each one of them

    try {
        const paginate = createPaginator({ page: page, perPage: perPage })
        return await paginate(
            db.offers,
            {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true,
                    image: true,
                    categoryId: true,
                    reviews: true,
                    rating: true,
                }
            }
        )

    } catch (err) {
        console.log(err)
        return "Server Error"
    }
}

async function getOfferByID(offerID) {

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

async function postOffer(data) {
    try {
        const finalOffer = await db.offers.create({
            data: {

                title: data.title,
                description: data.description,
                price: data.price,
                categoryId: data.category_id,
                image: data.image,
            }
        })

        return finalOffer

    } catch (err) {
        console.error(err)
        return "Server Error"
    }

}

async function editOffer(offerID, data) {
    try {
        const finalOffer = await db.offers.update({
            where: {
                id: offerID
            },
            data: {
                title: data.title,
                description: data.description,
                price: data.price,
                categoryId: data.category_id,
                image: data.image,
            }
        })

        return finalOffer

    } catch (err) {
        console.error(err)
        return "Server Error"
    }

}

async function deleteOffer(offerID) {
    try {
        
        const deletedOffer = await db.offers.delete({
            where: {
                id: offerID
            }
        })

        return deletedOffer

    } catch (err) {
        console.error(err)
        return "Server Error"
    }

}

module.exports = {
    getOffers,
    getOfferByID,
    postOffer,
    editOffer,
    deleteOffer
}
