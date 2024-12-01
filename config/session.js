const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');
const cookieParser = require('cookie-parser');

const redisClient = redis.createClient({ url: process.env.REDIS_URL });

redisClient.connect().catch((err) => {
    console.error('Redis connection error:', err);
    process.exit(1);
});

module.exports = (app) => {
    app.use(cookieParser());

    app.use(session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET || 'default_secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax',
        },
    }));
};
