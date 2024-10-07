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

const createOffer = require('./routes/createOffer')

const getAllOffers = require('./routes/getAllOffers')
const getOfferByID = require('./routes/getOfferByID')

const { isAuthenticated, isAdmin } = require('./utils/middlewares')
const { getUserByID } = require('./services/getUsers')

const app = express()
const port = process.env.SERVER_PORT || 3000

app.use(bodyParser.json({limit: '250mb', extended: true}));

app.use(
    bodyParser.urlencoded({
      limit: '250mb', extended: true
  })
)

// User Authentication
app.use('/register', register)
app.use('/login', login)
app.use('/refreshToken', refreshToken)
app.use('/verifyEmail', verifyEmail)

// Cteate new offer on the website
app.use('/createOffer', isAuthenticated, createOffer)

// Get the specific offers
// We do not need any authorisation for this as we want the users to get them on page load
app.use('/getAllOffers', getAllOffers)


app.use('/getOffer', getOfferByID)

app.get('/profile', isAuthenticated, async (req, res) => {
    const userId = req.payload.data.id 

    const user = await getUserByID(userId)
    delete user.password
    res.status(200).json({message: "Successfull", user: user})
})

app.get('/admin', isAdmin, async (req, res) => {
  res.status(200).json({message: "Hello Admin"})
})

app.post('/activate', isAdmin, async (req, res) => {

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