const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { authorized } = require("../middlewares/auth");

/*
* Route: /projects
*/

router.get('/', authorized, async (req, res) => {
    try {
        const project = await Project.findOne({
            $or: [
                { owner: req.session.userId },
                { members: req.session.userId }
            ]
        }).sort({ createdAt: -1 });

        if (!project) {
            const newProject = new Project({
                name: 'Mój projekt',
                description: 'Opis projektu',
                owner: req.session.userId,
                tasks: {
                    todo: [],
                    inprogress: [],
                    done: []
                }
            });

            await newProject.save();
            return res.redirect(`/projects/${newProject._id}`);
        }

        res.redirect(`/projects/${project._id}`);
    } catch (err) {
        console.error('[ERROR] Getting project failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:id', authorized, async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            $or: [
                { owner: req.session.userId },
                { members: req.session.userId }
            ]
        });

        if (!project) {
            return res.redirect('/dashboard');
        }

        const email = await req.session.userEmail;

        res.render('dashboard/todo', {
            projectId: project._id,
            layout: 'layouts/dashboard',
            title: project.name,
            user: {
                email
            },
        });
    } catch (err) {
        console.error('[ERROR] Getting project failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;