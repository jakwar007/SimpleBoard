const express = require('express');

const { authorized } = require('../middlewares/auth');
const Note = require('../models/Note');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const Project = require('../models/Project');
const router = express.Router();

/*
* Route: /dashboard
*/

router.get('/', authorized, async (req, res) => {
    const email = req.session.userEmail;
    const csrfToken = req.csrfToken();
    res.render('dashboard/dashboard', { title: 'Dashboard', user: { email }, csrfToken, layout: 'layouts/dashboard' });
});

router.get('/notes/:id', authorized, async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            error: 'Nieprawidłowy format ID notatki'
        });
    }

    try {
        const note = await Note.findOne({
            _id: new ObjectId(id),
            userId: req.session.userId
        });

        if (!note) {
            return res.status(404).json({
                error: 'Notatka nie została znaleziona'
            });
        }

        const csrfToken = req.csrfToken();
        const email = req.session.userEmail;

        res.render('dashboard/note', {
            title: 'Notatka',
            note,
            csrfToken,
            user: { email },
            layout: 'layouts/dashboard',
        });

    } catch (err) {
        console.error('Błąd podczas pobierania notatki:', err);
        res.status(500).json({
            error: 'Wystąpił błąd podczas pobierania notatki'
        });
    }
});

module.exports = router;