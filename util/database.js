// Sequelize with capital S because we import a constructor function or class here so import sequelize like this

const Sequelize = require('sequelize');

// connection to database
const sequelize = new Sequelize('node-complete','root','mysql123',{
    dialect : 'mysql',
    host :'localhost'
});
//const sequelize = new Sequelize (schema_name, user_name, password,options_object{connect to mysql database}, hostname)

module.exports = sequelize;