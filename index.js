const express = require('express');
const app = express();
const helmet = require('helmet')
const port = 3000;
const cookieSession = require('cookie-session')
const passport = require('passport');
const cors = require('cors')
const {setHeaders, auth} = require('./services/middlware')
const MetricContoller = require('./controllers/MetricContoller')
const ResultController = require('./controllers/ResultController')
const db = require('./db/models')
require('./services/passport')

app.use(express.json())
app.use(express.urlencoded())
app.use(helmet())


let whitelist = ['http://localhost:3001', 'http://localhost:3000/auth/google'];
        let corsOptions = {
            origin: (origin, callback)=>{
                if (whitelist.indexOf(origin) !== -1) {
                    callback(null, true)
                } else {
                  callback(null, true)
                }
            },credentials: true
        }

app.use(cors(corsOptions))


app.use(cookieSession({
  name: 'session',
  keys: ['rgedsdseds'],
  maxAge: 24 * 60 * 60 * 1000,
  secure: false // 24 hours
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(setHeaders)

// // Add headers
// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // // Request headers you wish to allow
//   // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });

//Auth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res, user) {
    res.redirect('http://localhost:3001/')
  });

app.get('/logout', (req, res) => {
  req.logOut();
  res.json({
    success: true
  })
})

app.get('/api/user', (req, res) => {
  res.json({user: req.user})
})

//Main Routes
app.use('/api', auth)

app.get('/api/metric', MetricContoller.index)
app.get('/api/metric/:id', MetricContoller.single)
app.post('/api/metric', MetricContoller.create)
app.post('/api/metric/update', MetricContoller.update)
app.post('/api/metric/delete', MetricContoller.delete)

app.post('/api/result', ResultController.create)
app.post('/api/result/update', ResultController.update)
app.post('/api/result/delete', ResultController.delete)


app.listen(port)

module.exports = app;