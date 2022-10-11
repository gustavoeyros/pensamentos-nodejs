const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('pensamentos', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
})



try{
    sequelize.authenticate()
}catch(error){
    console.log(err)
}


module.exports = sequelize