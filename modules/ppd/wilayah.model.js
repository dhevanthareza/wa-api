const sequelize = require("./../../model.loader");
const Sequelize = require("sequelize");
module.exports = sequelize.define(
  "Wilayah",
  {
    desa: {
      type: Sequelize.STRING,
    },
    kecamatan: {
      type: Sequelize.STRING,
    },
    flag: {
      type: Sequelize.NUMBER,
    },
  },
  {
    tableName: "ms_wilayah",
    paranoid: false,
    timestamps: false,
  }
);
