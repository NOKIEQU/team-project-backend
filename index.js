const express = require('express')
const bodyParser = require('body-parser')
const { db } = require('./utils/db')

const login = require('./routes/users/login')
const register = require('./routes/users/register')
const refreshToken = require('./routes/users/refreshToken')
const verifyEmail = require('./routes/users/verifyEmail')
const changePassword = require('./routes/users/changePassword')
const editUser = require('./routes/users/editUser')

const createOffer = require('./routes/offers/createOffer')

const getAllOffers = require('./routes/offers/getAllOffers')
const getOfferByID = require('./routes/offers/getOfferByID')

const getAllCategories = require('./routes/categories/getAllCategories')
const createCategory = require('./routes/categories/createCategory')
const deleteCategory = require('./routes/categories/deleteCategory')
const editCategory = require('./routes/categories/editCategory')


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
app.use('/editUser', isAuthenticated, editUser)
// Change Password
app.use('/changePassword', isAuthenticated, changePassword)

app.use('/createOffer', isAdmin, createOffer)
app.use('/getAllOffers', getAllOffers)
app.use('/getOffer', getOfferByID)


app.use('/getAllCategories', getAllCategories)
app.use('/createCategory', isAdmin, createCategory)
app.use('/deleteCategory', isAdmin, deleteCategory)
app.use('/editCategory', isAdmin, editCategory)

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