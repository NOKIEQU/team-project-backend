const express = require('express')
const router = express.Router()
const { createCategory } = require('../../services/manageCategories')

router.post('/', async (req, res) => {
    const data = req.body
    console.log(data)
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

       

        const createCat = await createCategory(data)

        if (createCat === "Category not created") {
            res.status(500).json({ message: "Could not create category" })
            return
        }

        res.status(200).json({ message: "Category created" })

    } catch (err) {
        res.status(500).json({ message: "Server Error" })
    }

}
)

module.exports = router
