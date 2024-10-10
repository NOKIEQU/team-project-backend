const { db } = require('../utils/db')

async function createReview(data) {
    try {
        const finalReview = await db.reviews.create({
            data: {
                rating: data.rating,
                comment: data.comment,
                offerId: data.offerId,
                userId: data.userId
            }
        })

        return finalReview

    } catch (err) {
        return "Review not created"
    }
}