const express = require('express')
const router = express.Router()
const { getCategories } = require('../../services/manageCategories')

router.get('/', async (req, res) => {
    try {
        const categories = await getCategories()
        res.status(200).json({ message: "Successfull", categories })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server Error" })
        return
    }
})

module.exports = router