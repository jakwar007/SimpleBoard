const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const User = require('../models/User');

router.get('/:id',async (req, res) => {
    const note = await Note.findOne({
        shareId: req.params.id,
    });

    if (!note) {
        return res.status(404).json({ error: 'Notatka nie została znaleziona' });
    }

    const user = await User.findOne({
        _id: note.userId
    });

    return res.render('sharedNote', {
        note,
        user,
        layout: false
    });
});

module.exports = router;