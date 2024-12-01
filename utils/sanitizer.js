const sanitizeHtml = require('sanitize-html');

module.exports.sanitizeBody = (req, res, next) => {
    if (req.body) {
        for (const key in req.body) {
            req.body[key] = sanitizeHtml(req.body[key], key);
        }
    }
}