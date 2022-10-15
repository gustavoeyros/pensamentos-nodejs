const User = require('../models/User')
const bcrypt = require('bcryptjs')
module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login')
    }
    static async loginPost(req, res) {
        const { email, password } = req.body
        //verificar usuário
        const user = await User.findOne({ where: { email: email } })
        if (!user) {
            req.flash('message', 'Usuário ou senha inválida')
            res.render('auth/login')
            return
        }

        //verificar senha
        const pwdMatch = bcrypt.compareSync(password, user.password)
        if (!pwdMatch) {
            req.flash('message', 'Usuário ou senha inválida')
            res.render('auth/login')
            return
        }


        //inicializar a sessão 
        req.session.userid = user.id

        req.flash('message', 'Autenticação realizada com sucesso!')
        req.session.save(() => {
            res.redirect('/')
        })

    }
    static register(req, res) {
        res.render('auth/register')
    }
    static async registerPost(req, res) {
        const { name, email, password, confirmpassword } = req.body
        //confirmar senha
        if (password != confirmpassword) {
            req.flash('message', 'As senhas não conferem!')
            res.render('auth/register')
            return
        }

        //verificar se o usuário existe
        const checkIfUserExists = await User.findOne({ where: { email: email } })
        if (checkIfUserExists) {
            req.flash('message', 'O e-mail já existe!')
            res.render('auth/register')
            return
        }

        //criptografar a senha
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        //registrar usuário no db

        const user = {
            name,
            email,
            password: hashedPassword
        }
        try {
            const createdUser = await User.create(user)

            //inicializar a sessão 
            req.session.userid = createdUser.id

            req.flash('message', 'Cadastro realizado com sucesso!')
            req.session.save(() => {
                res.redirect('/')
            })
        }
        catch (err) {
            console.log(err)
        }


    }
    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}