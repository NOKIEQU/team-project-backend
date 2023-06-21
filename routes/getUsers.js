const { db } = require('../utils/db')

async function getUserByID (id) {
    
    return db.user.findFirst({
        where: {
          id
        },
        
      })
}

async function GetUserByEmail (email) {
    return db.user.findUnique({
        where: {
            email
        },
        
      })
}

async function getAllUsers () {
    return db.user.findMany()
}



module.exports = {
    getAllUsers,
    getUserByID,
    GetUserByEmail,
}