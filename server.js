require('dotenv').config();
const express = require('express');
const router = express.Router();
const path = require('path');
const connectDB = require('./config/database');
const session = require('./config/session')
const applyMiddleware = require('./config/middleware');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');

// Routes
const authRoutes = require('./routes/authRoutes');
const apiAuthRoutes = require('./routes/api/auth');
const apiNotesRoutes = require('./routes/api/notes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const sharedNotesRoutes = require('./routes/sharedNotesRoutes');
const projectRoutes = require('./routes/projectsRoutes');
const apiTagsRoutes = require('./routes/api/tags');
const apiProjectsRoutes = require('./routes/api/projects');


const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
session(app);
app.use(cookieParser());
applyMiddleware(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);

app.use('/auth', authRoutes);
app.use('/api/auth', apiAuthRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/api/notes', apiNotesRoutes);
app.use('/api/tags', apiTagsRoutes);
app.use('/n', sharedNotesRoutes); // Shared notes
app.use('/projects', projectRoutes);
app.use('/api/projects', apiProjectsRoutes);

router.get('/', (req, res) => {
    res.redirect('/dashboard');
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http:/localhost:${PORT}`));