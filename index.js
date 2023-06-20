const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const express = require('express')
const bodyParser = require('body-parser')


const login = require('./routes/login')
const register = require('./routes/register')
const refreshToken = require('./routes/refreshToken')

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
    const userId = req.payload.userId 
    const { id } = req.body

    if (userId !== id) {
      res.status(401).json({message: "Unauthorized"})
      return
    }

    const user = await getUserByID(id)
    delete user.password
    res.status(200).json({message: "Successfull", user: user})
})

app.get('/admin', isAdmin, async (req, res) => {
  res.status(200).json({message: "Hello Admin"})
})


app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
`),
)