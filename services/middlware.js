const setHeaders = function(req, res, next){
    res.set('Access-Control-Allow-Credentials', true)
    next();
  }

const auth = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next(); 
    }

    // denied. redirect to login
    res.redirect('http://localhost:3001/')
}

module.exports = {
    setHeaders,
    auth
}