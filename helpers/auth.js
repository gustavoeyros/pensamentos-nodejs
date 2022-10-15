//verificar se o usuário está logado para acessar a url
module.exports.checkAuth = function(req, res, next){
    const userId =  req.session.userid
    if(!userId){
        res.redirect('/login')
    }
    next()
}