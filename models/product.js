//importing Sequelize which gives back class or constructor function hence name here with capital S
//const {Models} = require('sequelize');
const Sequelize = require('sequelize');

//importing database connection pool managed by sequelize
const sequelize = require('../util/database')

//defining MODEL that will managed by sequelize

//In constant Product = defing product model using sequelize (having all features of sequelize package)
const Product = sequelize.define('product',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Product;

//Now we use this Product