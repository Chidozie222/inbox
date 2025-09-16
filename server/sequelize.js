const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("chatdb", "root", "blessing", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
