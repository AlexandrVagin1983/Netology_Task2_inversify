const express = require('express')
const bodyParser = require("body-parser")
const mongoose = require('mongoose')

const logger   = require('./middleware/logger')
const error404 = require('./middleware/err-404')

const booksApiRouter = require('./routes/api/books')
const booksRouter = require('./routes/books')
const indexRouter = require('./routes/index')

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(logger)
app.use('/', indexRouter)
app.use('/book/api', booksApiRouter)
app.use('/book', booksRouter)
app.use(error404)

const PORT = process.env.PORT || 3000
const UserDB = process.env.DB_USERNAME || 'root';
const PasswordDB = process.env.DB_PASSWORD || 'qwerty12345';
const NameDB = process.env.DB_NAME || 'books'
const HostDb = process.env.DB_HOST || 'mongodb://localhost:27017/'

async function start() {
    console.log(`Start procedure HostDb:${HostDb}, PasswordDB:${PasswordDB}, NameDB:${NameDB}`)
    try {       
        await mongoose.connect(HostDb, {
            user: UserDB,
            pass: PasswordDB,
            dbName: NameDB,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (e) {
        console.log(`Error1: ${e}`);
    }
}

start();
