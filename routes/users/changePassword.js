const express = require('express')
const router = express.Router()

const { changePassword } = require('../../services/manageUser')

router.post('/', async (req, res) => {
    const data = req.body

    if (!data) {
        res.status(400).json({ message: "Data must be provided" })
        return
    }

    try {

        if (!data.oldPassword || !data.newPassword) {
            res.status(400).json({ message: "Missing Values" })
            return
        }

        if (data.oldPassword === "" || data.newPassword === "") {
            res.status(400).json({ message: "Values cannot be empty" })
            return
        }

        const changePass = await changePassword(data)

        if (changePass === "User not found") {
            res.status(404).json({ message: "User not found" })
            return
        }

        if (changePass === "Incorrect Password") {
            res.status(400).json({ message: "Incorrect Password" })
            return
        }

        res.status(200).json({ message: "Password changed" })

    } catch (err) {
        res.status(500).json({ message: "Server Error" })
    }

}
)

module.exports = router