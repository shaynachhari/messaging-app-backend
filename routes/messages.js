const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

router.post('/send', async (req, res) => {
  const { sender, receiver, text } = req.body;

  try {
    const message = new Message({ sender, receiver, text });
    await message.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.params.id }).populate('sender', 'name');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/reply', async (req, res) => {
  const { messageId, sender, text } = req.body;

  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    message.replies.push({ sender, text });
    await message.save();
    res.json({ message: 'Reply sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
