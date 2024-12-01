const express = require('express');
const Note = require('../../models/Note');
const {authorized} = require("../../middlewares/auth");
const crypto = require('crypto');

const router = express.Router();

/*
* Route: /api/notes
*/

router.get('/', authorized, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.session.userId })
            .sort({ updatedAt: -1 });
        res.json({
            count: notes.length,
            notes: notes
        });
    } catch (err) {
        console.error('[ERROR] Getting notes failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:id', authorized, async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            userId: req.session.userId
        });

        if (!note) {
            return res.status(404).json({ error: 'Notatka nie została znaleziona' });
        }

        res.json(note);
    } catch (err) {
        console.error('[ERROR] Getting note failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', authorized, async (req, res) => {
    try {
        const note = new Note({
            userId: req.session.userId,
            title: req.body.title,
            content: '',
            tags: req.body.tags
        });

        await note.save();
        res.status(201).json(note);
    } catch (err) {
        console.error('[ERROR] Creating note failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:id', authorized, async (req, res) => {
    try {
        const note = await Note.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.session.userId
            },
            {
                title: req.body.title,
                content: req.body.content,
                tags: req.body.tags
            },
            { new: true }
        );

        if (!note) {
            return res.status(404).json({ error: 'Notatka nie została znaleziona' });
        }

        res.json(note);
    } catch (err) {
        console.error('[ERROR] Updating note failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:id', authorized, async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            userId: req.session.userId
        });

        if (!note) {
            return res.status(404).json({ error: 'Notatka nie została znaleziona' });
        }

        res.json({ message: 'Notatka została usunięta' });
    } catch (err) {
        console.error('[ERROR] Deleting note failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/:id/share', authorized, async (req, res) => {
    const note = await Note.findOne({
       _id: req.params.id,
        userId: req.session.userId
    });

    if (!note) {
        return res.status(404).json({ error: 'Notatka nie została znaleziona' });
    }

    if (note.shareId) {
        return res.status(200).json({ shareId: note.shareId, url: process.env.CLIENT_URL + `/n/${note.shareId}` });
    }

    try {
        const shareId = await generateShareId();
        note.shareId = shareId;
        await note.save();

        res.json({ shareId, url: process.env.CLIENT_URL + `/n/${shareId}` });
    } catch (err) {
        console.error('[ERROR] Creating shareId failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function generateShareId() {
    return crypto.randomBytes(4).toString('hex');
}

module.exports = router;