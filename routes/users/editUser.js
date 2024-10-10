const express = require('express')
const router = express.Router()
const {editUser} = require('../../services/manageUser')

router.post('/', async (req, res) => {
    const data = req.body
    const userId = req.payload.data.id

    if (!data) {
        res.status(400).json({ message: "Data must be provided" })
        return
    }

    try {
        const edit = await editUser(userId, data)

        if (edit === "User not found") {
            res.status(404).json({ message: "User not found" })
            return
        }

        res.status(200).json({ message: "User edited" })

    } catch (err) {
        res.status(500).json({ message: "Server Error" })
    }

}
)

module.exports = router
