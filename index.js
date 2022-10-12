const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
const app = express()
const conn = require('./db/conn')
require('dotenv').config()
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
app.use(express.static('public'))
//respostas do body
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
//import Routes
const thoughsRoutes = require('./routes/thoughtsRoutes')


//Models
const Thought = require('./models/Thought')
const User = require('./models/User')

//Controllers
const ThoughtController = require('./controllers/ThoughtController')




//middleware da sessão
app.use(
    session({
        name: "session",
        secret: `${process.env.SECRET_KEY}`,
        resave: "false",
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000, //equivale a 1 dia
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
)

//flash messages
app.use(flash())

//salvar a sessão na resposta
app.use((req, res, next)=>{
    if(req.session.userid){
        res.locals.session = req.session
    }
    next()
})

//Routes
app.use('/thoughts', thoughsRoutes)

app.get('/', ThoughtController.showThoughts)

conn.sync().then(()=>{
    app.listen(3000)
}).catch((err)=>{
    console.log(err)
})