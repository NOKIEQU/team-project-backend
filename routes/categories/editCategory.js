const express = require('express')
const router = express.Router()
const { editCategory } = require('../../services/manageCategories')

router.post('/:id', async (req, res) => {
    const { id } = req.params
    const data = req.body

    if (!id) {
        res.status(400).json({ message: "ID must be provided" })
        return
    }

    if (!data) {
        res.status(400).json({ message: "Data must be provided" })
        return
    }

    try {

        if (!data.name || !data.description) {
            res.status(400).json({ message: "Missing Values" })
            return
        }

        if (data.name === "" || data.description === "") {
            res.status(400).json({ message: "Values cannot be empty" })
            return
        }

        

        const editCat = await editCategory(id, data)

        if (editCat === "Category not found") {
            res.status(404).json({ message: "Category not found" })
            return
        }

        res.status(200).json({ message: "Category edited" })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }

}
)

module.exports = router