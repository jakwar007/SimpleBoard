require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const createDemoUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await User.deleteOne({ email: 'demo@email.com' });

        const user = new User({
            email: 'demo@email.com',
            password: '1234',
        });

        await user.save();
        console.log('User created successfully!');
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
}

createDemoUser();