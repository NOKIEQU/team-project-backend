const express = require('express')
const router = express.Router()
const { checkAdmin } = require('../../services/manageUser')
const { deleteCategory } = require('../../services/manageCategories')

router.delete('/:id', async (req, res) => {
    const { id } = req.params

    if (!id) {
        res.status(400).json({ message: "ID must be provided" })
        return
    }

    try {

       

        const deleteCat = await deleteCategory(id)

        if (deleteCat === "Category not found") {
            res.status(404).json({ message: "Category not found" })
            return
        }

        res.status(200).json({ message: "Category deleted" })

    } catch (err) {
        res.status(500).json({ message: "Server Error" })
    }

}
)

module.exports = router
