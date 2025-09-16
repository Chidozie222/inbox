module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("Message", {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User, { as: "sender", foreignKey: "senderId" });
    Message.belongsTo(models.Conversation, { foreignKey: "conversationId" });
  };

  return Message;
};
