const express = require('express');
const router = express.Router();
const Tag = require('../../models/Tag');

router.get('/', async (req, res) => {
    try {
        const tags = await Tag.find({ userId: req.session.userId }).sort({ name: 1 });
        res.json(tags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const tag = new Tag({
            name: req.body.name.toLowerCase(),
            userId: req.session.userId
        });
        const newTag = await tag.save();
        res.status(201).json(newTag);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Tag already exists' });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
});

module.exports = router;