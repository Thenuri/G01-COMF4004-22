// node module imports
const express = require('express')
const dotenv = require('dotenv')
dotenv.config();

// to parse json in body
const bodyParser = require('body-parser') 

// router imports
const authRouter = require('./routes/auth')


const app = express()

// middleware 

app.use(bodyParser.json()) // to parse json to req.body



// Use routers
app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
    res.send("hello")
})



const port = process.env.APP_PORT || 3000
app.listen(port, () => {
    console.log(`App is listening on port:${port}`)
})