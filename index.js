const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const express = require('express')
const bodyParser = require('body-parser')
const { db } = require('./utils/db')
const jwt = require("jsonwebtoken")

const login = require('./routes/login')
const register = require('./routes/register')
const refreshToken = require('./routes/refreshToken')
const verifyEmail = require('./routes/verifyEmail')

const { isAuthenticated, isAdmin } = require('./utils/middlewares')
const { getUserByID } = require('./routes/getUsers')

const app = express()
const port = process.env.SERVER_PORT || 3000

app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({
    extended: true,
  })
)

app.use('/register', register)
app.use('/login', login)
app.use('/refreshToken', refreshToken)
app.use('/verifyEmail', verifyEmail)

// app.get('/', async (req, res) => {
//     res.status(200).json({message: "Successfull!"})
// })

// app.get('/getusers', async (req, res) => {
//     try {
    
//         const users = await prisma.user.findMany()
        
//         res.status(200).json({message: "Successfull", data: users})

//     } catch (err) {
//         console.log(err)
//         res.status(500).json({message: "Internal Server Error!"})
//     }
// })

app.get('/profile', isAuthenticated, async (req, res) => {
    const userId = req.payload.data.id 

    const user = await getUserByID(userId)
    delete user.password
    res.status(200).json({message: "Successfull", user: user})
})

app.get('/admin', isAdmin, async (req, res) => {
  res.status(200).json({message: "Hello Admin"})
})

app.post('/activate', async (req, res) => {

  const { id } = req.body

  try {

    await db.user.update({
      where: {
        id: id
      },
      data: {
        activated: true
      }
    })

    res.status(200).json({message: "Activated Successfully"})

  } catch (err) {
    console.error(err)
    res.status(500).json({message: "Internal Server Error"})
  }

})

app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
`),
)