const bcrypt = require('bcrypt')
const { db } = require('../utils/db')

function getUserByID (id) {
    return db.user.findUnique({
        where: {
          id,
        },
      })
}

function GetUserByEmail (email) {
    return db.user.findUnique({
        where: {
            email,
        },
      })
}

function getAllUsers () {
    return db.user.findMany()
}

module.exports = {
    getAllUsers,
    getUserByID,
    GetUserByEmail
}