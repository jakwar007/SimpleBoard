const cors = require('cors');
const csrf = require('csurf');
const helmet = require('helmet');
const sanitizeHtml = require('sanitize-html');
const Project = require('../models/Project');


module.exports = (app) => {
    app.use(cors());
    app.use(csrf({
        cookie: true,
        ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
        ignore: [
            '/api/notes',
            '/api/notes/*',
        ]
    }));
    app.use(async (req, res, next) => {
        try {
            res.locals.csrfToken = req.csrfToken();
        } catch (err) {
            console.error('CSRF token generation failed:', err);
        }

        if (req.session.userId) {
            try {
                const projects = await Project.find({
                    $or: [
                        { owner: req.session.userId },
                        { members: req.session.userId }
                    ]
                }).sort({ updatedAt: -1 });
                res.locals.projects = projects;
            } catch (err) {
                console.error('[ERROR] Getting projects failed:', err);
            }
        }
        res.locals.currentPath = req.path;
        next();
    });
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", 'https://code.jquery.com', 'https://cdnjs.cloudflare.com', 'https://cdn.jsdelivr.net/'],
                styleSrc: ["'self'", 'https://fonts.googleapis.com'],
                fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            },
        },
    }));
    app.use((req, res, next) => {
        res.locals = {
            ...res.locals,
            sanitize: (content) => sanitizeHtml(content, {
                allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
                allowedAttributes: {
                    'a': [ 'href' ]
                }
            })
        };
        next();
    });
};
