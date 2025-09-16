const express = require("express");
const { User, Message, Conversation } = require("../models");
const setPassword = require("../utils/passwordHashing");
const router = express.Router();


// Register endpoint
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

    try {
      let passwordHash = await setPassword(password);
        const user = await User.create({ username, passwordHash });
    await user.save();
    res.json({ message: "✅ User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ message: "✅ Login successful", userId: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
