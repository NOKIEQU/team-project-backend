const { db } = require('../utils/db')

async function createOrder(data) {
    try {
        const finalOrder = await db.orders.create({
            data: {
                offerId: data.offerId,
                userId: data.userId,
                status: data.status,
                quantity: data.quantity
            }
        })

        return finalOrder

    } catch (err) {
        console.error(err)
        return "Order not created"
    }

}

async function updateOrderStatus(id, status) {
    try {
        const updatedOrder = await db.orders.update({
            where: {
                id
            },
            data: {
                status
            }
        })

        return updatedOrder

    } catch (err) {
        console.error(err)
        return "Order not updated"
    }
}

async function deleteOrder(id) {
    try {
        const deletedOrder = await db.orders.delete({
            where: {
                id
            }
        })

        return deletedOrder

    } catch (err) {
        console.error(err)
        return "Order not deleted"
    }
}

module.exports = {
    createOrder,
    updateOrderStatus,
    deleteOrder
}