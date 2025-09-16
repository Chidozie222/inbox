const { Message, User, Conversation } = require("./models");
const { Op } = require("sequelize");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("⚡ Client connected", socket.id);

    // Send a message
    socket.on("message", async ({ senderId, receiverId, content }) => {
      try {
        // 1. Find or create a conversation between these 2 users
        let conversation = await Conversation.findOne({
          where: {
            [Op.or]: [
              { user1Id: senderId, user2Id: receiverId },
              { user1Id: receiverId, user2Id: senderId },
            ],
          },
        });

        if (!conversation) {
          conversation = await Conversation.create({
            user1Id: senderId,
            user2Id: receiverId,
          });
        }

        const conversationId = conversation.id;

        // 2. Join the sender to the conversation room
        socket.join(conversationId);

        // 3. Save message in DB
        const newMessage = await Message.create({
          content,
          senderId,
          conversationId,
        });

        // 4. Fetch full message (with sender info)
        const fullMessage = await Message.findOne({
          where: { id: newMessage.id },
          include: [
            {
              model: User,
              as: "sender",
              attributes: ["id", "username"],
            },
          ],
        });

        // 5. Emit the new message to everyone in the conversation
        io.to(conversationId).emit("message", fullMessage);
      } catch (err) {
        console.error("❌ Error handling message:", err);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("❌ Client disconnected", socket.id);
    });
  });
};
