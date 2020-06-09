const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "ppdblora2020_",
  "masaboesalam",
  "dhitaauliaoctavianiSALAM",
  {
    host: "192.168.0.23",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
