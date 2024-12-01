const express = require('express');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();

/*
* Route: /api/auth
*/

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const passwordString = password.toString();

    try {
        const user = await User.findOne({ email });

        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(passwordString, salt);

        const isMatch = await bcrypt.compare(passwordString, user.password);


        if (!isMatch) {
            return res.status(401).json({ message: 'Podane hasło jest nieprawidłowe.' });
        }

        req.session.userId = user._id;
        req.session.userEmail = user.email;

        res.status(200).json({ message: 'Zalogowano pomyślnie!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
