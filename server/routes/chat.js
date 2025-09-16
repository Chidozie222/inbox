// const express = require("express");
// const { Op } = require("sequelize");
// const { User, Message, Conversation } = require("../models");

// const router = express.Router();

// router.get("/conversations/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const conversations = await Conversation.findAll({
//       where: {
//         [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
//       },
//       include: [
//         {
//           model: Message,
//           limit: 1,
//           order: [["createdAt", "DESC"]],
//           separate: true,
//         },
//         {
//           model: User,
//           as: "user1",
//           attributes: ["id", "username"],
//         },
//         {
//           model: User,
//           as: "user2",
//           attributes: ["id", "username"],
//         },
//       ],
//     });

//     res.json(conversations);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to load conversations" });
//   }
// });

// router.get("/messages/:senderId/:receiverId", async (req, res) => {
//   try {
//     const { senderId, receiverId } = req.params;

//     // 1. Find existing conversation (works regardless of order)
//     let conversation = await Conversation.findOne({
//       where: {
//         [Op.or]: [
//           { user1Id: senderId, user2Id: receiverId },
//           { user1Id: receiverId, user2Id: senderId },
//         ],
//       },
//     });

//     // 2. If no conversation, create it
//     if (!conversation) {
//       conversation = await Conversation.create({
//         user1Id: senderId,
//         user2Id: receiverId,
//       });
//     }

//     // 3. Fetch all messages in this conversation
//     const messages = await Message.findAll({
//       where: { conversationId: conversation.id },
//       include: [
//         {
//           model: User,
//           as: "sender",
//           attributes: ["id", "username"],
//         },
//       ],
//       order: [["createdAt", "ASC"]],
//     });

//     res.json({
//       conversationId: conversation.id, // hidden from user, but useful internally
//       messages,
//     });
//   } catch (err) {
//     console.error("❌ Error loading messages:", err);
//     res.status(500).json({ error: "Failed to load messages" });
//   }
// });

// module.exports = router;


const express = require("express");
const { Op } = require("sequelize");
const { User, Message, Conversation } = require("../models");

const router = express.Router();

// 1. Get all conversations for a user
router.get("/conversations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: [
        { model: User, as: "user1", attributes: ["id", "username"] },
        { model: User, as: "user2", attributes: ["id", "username"] },
      ],
    });

    res.json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load conversations" });
  }
});

// 2. Get all messages in a conversation (already had this)
router.get("/messages/:conversationId", async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.findAll({
      where: { conversationId },
      include: [{ model: User, as: "sender", attributes: ["id", "username"] }],
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load messages" });
  }
});

// routes/chat.js
router.post("/conversations/start", async (req, res) => {
  try {
    const { user1Id, user2Id } = req.body;

    let conversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id }
        ]
      },
      include: [
        { model: User, as: "user1", attributes: ["id", "username"] },
        { model: User, as: "user2", attributes: ["id", "username"] }
      ]
    });

    if (!conversation) {
      conversation = await Conversation.create({ user1Id, user2Id });
      // Fetch again with user info
      conversation = await Conversation.findByPk(conversation.id, {
        include: [
          { model: User, as: "user1", attributes: ["id", "username"] },
          { model: User, as: "user2", attributes: ["id", "username"] }
        ]
      });
    }

    res.json(conversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start conversation" });
  }
});


module.exports = router;
