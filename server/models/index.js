const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("chatdb", "root", "blessing", {
  host: "localhost",
  dialect: "mysql", // or postgres
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require("./User")(sequelize, DataTypes);
db.Message = require("./Message")(sequelize, DataTypes);
db.Conversation = require("./Conversation")(sequelize, DataTypes);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced ✅");
  })
  .catch((err) => {
    console.error("Failed to sync DB ❌:", err);
  });


// Run associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
