const bcrypt = require('bcrypt')
const { db } = require('./utils/db')
const readlineSync = require('readline-sync')

console.log("Please provide a valid email for the admin user:")
const email = readlineSync.question("Email: ")

console.log("Please provide a valid password for the admin user:")
const password = readlineSync.question("Password: ")

console.log("Please provide a valid username for the admin user:")
const username = readlineSync.question("Username: ")


function createUser() {
    const hashPassword = bcrypt.hashSync(password, 12)
    return db.user.create({
        data: {
            email: email,
            password: hashPassword,
            username: username,
            role: "ADMIN",
            activated: true,
            banned: false,
        },
    })
}

try {
    createUser()
    console.log("Admin user created successfully")

}
catch (err) {
    console.error(err)
}

