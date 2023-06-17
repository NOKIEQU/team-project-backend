const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const express = require('express')
const bodyParser = require('body-parser')
const {v4: uuidv4} = require('uuid')
const jwt = require('./utils/jwt')
const addRefreshTokenToWhitelist = require('./utils/auth')
const { GetUserByEmail } = require('./routes/getUsers')

const app = express()

const port = process.env.SERVER_PORT || 3000

app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', async (req, res) => {
    res.status(200).json({message: "Successfull!"})
})

app.get('/getusers', async (req, res) => {
    try {
    
        const users = await prisma.user.findMany()
        
        res.status(200).json({message: "Successfull", data: users})

    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Internal Server Error!"})
    }
})

app.post('/register', async (req, res) => {

    try {
        
        const { username, email, password, confirmPassword } = req.body

        let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

        if (!email.match(emailRegex)) {
            res.status(400).json({message: "Invalid Email"})
        }

        const checkUser = !!await prisma.user.findFirst({
                where: {
                    username: username
                }
        })

        const checkEmail = !!await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if (checkUser) {
            res.status(400).json({message: "Username already exists."})
            return
        }

        if (username > 20) {
            res.status(400).json({message: "Username cannot have more than 20 characters."})
            return
        }
        
        if (checkEmail) {
            res.status(400).json({message: "Email already exists."})
            return
        }

        if (password !== confirmPassword) {
            res.status(400).json({message: "Passwords must match"})
            return
        }

        if (!username || username.lenght === 0) {
            res.status(400).json({message: "Username cannot be empty"})
            return
        }

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password
            }
        })
        const jti = uuidv4();
        const { accessToken, refreshToken } = generateTokens(newUser, jti)
        await addRefreshTokenToWhitelist({ jti, refreshToken, userId: newUser.id })

        res.status(200).json({message: "User created successfully!", token: accessToken, refresh: refreshToken})

    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Internal Server Error!"})
    }

})

app.post('/login', async (req, res) => {
    try {
        
        const { email, password } = req.body
        const existingUser = await GetUserByEmail(email);
        const validPassword = await bcrypt.compare(password, existingUser.password);

        if (!email || !password) {
            res.status(400).json({message: "You must provide login credentials"});
        }


        if (!existingUser) {
            res.status(403).json({message: "Invalid login credentials"})
        }


        if (!validPassword) {
            res.status(403).json({message: "Invalid login credentials"})
        }

        const jti = uuidv4();
        const { accessToken, refreshToken } = generateTokens(existingUser, jti);
        await addRefreshTokenToWhitelist({ jti, refreshToken, userId: existingUser.id })
        
        res.status(200).json({message: "Successfull", token: accessToken, refresh: refreshToken})

    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Internal Server Error!"})
    }
})

app.post('/refreshToken', async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400);
        throw new Error('Missing refresh token.');
      }
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const savedRefreshToken = await findRefreshTokenById(payload.jti);
  
      if (!savedRefreshToken || savedRefreshToken.revoked === true) {
        res.status(401);
        throw new Error('Unauthorized');
      }
  
      const hashedToken = hashToken(refreshToken);
      if (hashedToken !== savedRefreshToken.hashedToken) {
        res.status(401);
        throw new Error('Unauthorized');
      }
  
      const user = await findUserById(payload.userId);
      if (!user) {
        res.status(401);
        throw new Error('Unauthorized');
      }
  
      await deleteRefreshToken(savedRefreshToken.id);
      const jti = uuidv4();
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti);
      await addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, userId: user.id });
  
      res.json({
        accessToken,
        refreshToken: newRefreshToken
      });
    } catch (err) {
      next(err);
    }
  })

app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
`),
)