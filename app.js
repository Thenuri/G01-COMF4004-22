// node module imports
const express = require('express')
const dotenv = require('dotenv')
dotenv.config();
const cookieParser = require('cookie-parser')

// router imports
const authRouter = require('./routes/auth')
const bookingRouter = require('./routes/booking')
const filterRouter = require('./routes/filter')

const app = express()

// middleware 

// to parse json in body
const bodyParser = require('body-parser') 
app.use(bodyParser.json()) // to parse json to req.body

// to parse cookies
app.use(cookieParser())

// authenticate
// if auth success will add email, and account id to req.body.Email, req.body.Account_ID
const AuthenicateWithJWT = require('./middleware/authMiddleware') 



// Use routers
app.use('/api/auth', authRouter)

app.use('/booking', bookingRouter)
app.use('/filter', filterRouter)

app.get('/', (req, res) => {
    res.send("hello")
})


// test
app.get('/protected', AuthenicateWithJWT, (req, res) => {
    res.json({
        "message": "Authenticated",
        "email" : req.body.Email
    })
})


const port = process.env.APP_PORT || 3000
app.listen(port, () => {
    console.log(`App is listening on port:${port}`)
})