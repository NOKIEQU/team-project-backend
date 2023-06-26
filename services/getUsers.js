const { db } = require('../utils/db')

async function getUserByID (id) {
    
    try {
        return db.user.findFirst({
            where: {
              id
            },
            
          })
    } catch (err) {
        return "User not Found"
    }

    
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