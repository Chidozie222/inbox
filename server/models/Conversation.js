// models/conversation.js
module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define("Conversation", {
    user1Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user2Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true, // optional title if you want
    },
  });

  Conversation.associate = (models) => {
    // A conversation has many messages
    Conversation.hasMany(models.Message, {
      foreignKey: "conversationId",
      onDelete: "CASCADE",
    });

    // Conversation belongs to two users
    Conversation.belongsTo(models.User, {
      as: "user1",
      foreignKey: "user1Id",
    });
    Conversation.belongsTo(models.User, {
      as: "user2",
      foreignKey: "user2Id",
    });
  };

  return Conversation;
};
