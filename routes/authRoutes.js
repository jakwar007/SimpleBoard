const express = require('express');
const { User } = require('../models/User');
const { guest, authorized } = require('../middlewares/auth');

const router = express.Router();

/*
* Route: /auth/login
* Method: GET
* Description: Renders the login page
 */
router.get('/login', guest, (req, res) => {
    try {
        const csrfToken = req.csrfToken();
        res.render('auth/login', { title: 'Logowanie', csrfToken, layout: false });
    } catch (err) {
        console.error('[ERROR] Login render failed:', err);
        res.status(500).send('Internal Server Error');
    }
});

/*
* Route: /auth/logout
* Method: POST
* Description: Logs out the user
*/

router.post('/logout', authorized, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('[ERROR] Logout failed:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.clearCookie('connect.sid');
        res.redirect('/auth/login');
    });
});

module.exports = router;
