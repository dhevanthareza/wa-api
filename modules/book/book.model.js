const sequelize = require('./../../model.loader');
const Sequelize = require('sequelize')
module.exports = sequelize.define('Book', {
  name: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING
  }
}, {
  paranoid: false,
  timestamps: false
});
