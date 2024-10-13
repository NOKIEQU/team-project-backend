const { db } = require('../utils/db')
const { getUserByID } = require('./getUsers')

async function activateUser (id) {
    db.user.update({
        where: {
            id
        },
        data: {
            activated: true
        }
    })
}

async function changePassword (id, newPassword) {
    db.user.update({
        where: {
            id
        },
        data: {
            password: newPassword
        }
    })
}

async function banUser (id) {
    db.user.update({
        where: {
            id
        },
        data: {
            banned: true
        }
    })
}

async function unbanUser (id) {
    db.user.update({
        where: {
            id
        },
        data: {
            banned: false
        }
    })
}

async function isBanned (id) {
    const user = await getUserByID(id)
        
    if (user.banned) {
        return true
    }

    return false
}

async function isActivated (id) {
    const user = await getUserByID(id)
    if (!user.activated) {
        return false
    }

    return true
}

async function checkAdmin (id) {
    const user = await getUserByID(id)
    if (user.role !== "ADMIN") {
        return false
    }

    return true
}   

async function editUser (id, data) {
    const user = await getUserByID(id)

    if (!user) {
        return "User not found"
    }

    db.user.update({
        where: {
            id
        },
        data: {
            username: data.username,
            email: data.email,

        }
    })
}

module.exports = { 
    activateUser,
    changePassword,
    banUser,
    unbanUser,
    isBanned,
    isActivated,
    checkAdmin,
    editUser 
}