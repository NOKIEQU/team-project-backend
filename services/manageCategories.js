const { db } = require('../utils/db')
const { Prisma } = require('@prisma/client')

async function getCategories() {

    try {

        return await db.categories.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            }
        })

    } catch (err) {
        return "Server Error"
    }


}

async function getCategoryByID(categoryID) {
    try {

        try {

            return await db.categories.findUnique({
                where: {
                    id: categoryID
                }
            })

        } catch (err) {
            return "Category not found"
        }

    } catch (err) {
        return "Server Error"
    }
}

async function createCategory(data) {
    try {

        try {

            var finalCategory = await db.categories.create({
                data: {
                    name: data.name,
                    description: data.description,
                }
            })

            return finalCategory

        } catch (err) {
            return "Category not created"
        }

    } catch (err) {
        return "Server Error"
    }
}

async function deleteCategory(categoryID) {
    try {

        try {

            var deletedCategory = await db.categories.delete({
                where: {
                    id: categoryID
                }
            })

            return deletedCategory

        } catch (err) {
            return "Category not found"
        }

    } catch (err) {
        return "Server Error"
    }
}

async function editCategory(categoryID, data) {
    console.log(categoryID)
    console.log(data)
    try {

        try {

            var editedCategory = await db.categories.update({
                where: {
                    id: categoryID
                },
                data: {
                    name: data.name,
                    description: data.description
                }
            })

            return editedCategory

        } catch (err) {
            console.log(err)
            return "Category not found"
        }

    } catch (err) {
        return "Server Error"
    }
}

module.exports = {
    getCategories,
    getCategoryByID,
    createCategory,
    deleteCategory,
    editCategory
}

