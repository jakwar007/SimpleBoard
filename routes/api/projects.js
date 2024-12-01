const express = require('express');
const Project = require('../../models/Project');
const { authorized } = require("../../middlewares/auth");
const router = express.Router();

/*
* Route: /api/projects
*/

router.get('/', authorized, async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { owner: req.session.userId },
                { members: req.session.userId }
            ]
        }).sort({ updatedAt: -1 });

        res.json({
            count: projects.length,
            projects: projects
        });
    } catch (err) {
        console.error('[ERROR] Getting projects failed:', err);
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
            return res.status(404).json({ error: 'Projekt nie został znaleziony' });
        }

        res.json(project);
    } catch (err) {
        console.error('[ERROR] Getting project failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', authorized, async (req, res) => {
    try {
        const project = new Project({
            name: req.body.name,
            description: req.body.description,
            owner: req.session.userId,
            members: req.body.members || [],
            tasks: {
                todo: [],
                inprogress: [],
                done: []
            }
        });

        await project.save();
        res.status(201).json(project);
    } catch (err) {
        console.error('[ERROR] Creating project failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:id', authorized, async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate(
            {
                _id: req.params.id,
                owner: req.session.userId
            },
            {
                name: req.body.name,
                description: req.body.description,
                members: req.body.members
            },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ error: 'Projekt nie został znaleziony' });
        }

        res.json(project);
    } catch (err) {
        console.error('[ERROR] Updating project failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:id/pos', authorized, async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            $or: [
                { owner: req.session.userId },
                { members: req.session.userId }
            ]
        });

        if (!project) {
            return res.status(404).json({ error: 'Projekt nie został znaleziony' });
        }

        await project.updatePositions(req.body.posBuffer);
        res.json({ message: 'Pozycje zostały zaktualizowane' });
    } catch (err) {
        console.error('[ERROR] Updating positions failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/:id/tasks', authorized, async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            $or: [
                { owner: req.session.userId },
                { members: req.session.userId }
            ]
        });

        if (!project) {
            return res.status(404).json({ error: 'Projekt nie został znaleziony' });
        }

        await project.addTask(req.body.groupId, {
            content: req.body.content,
            priority: req.body.priority
        }).then(taskId => res.json({ taskId })).catch(err => console.log(err));

    } catch (err) {
        console.error('[ERROR] Adding task failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:id/tasks/:taskId/move', authorized, async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            $or: [
                { owner: req.session.userId },
                { members: req.session.userId }
            ]
        });

        if (!project) {
            return res.status(404).json({ error: 'Projekt nie został znaleziony' });
        }

        await project.moveTask(
            req.params.taskId,
            req.body.toGroup
        );

        res.json(project);
    } catch (err) {
        console.error('[ERROR] Moving task failed:', err, req.body.toGroup);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:id/tasks/:taskId', authorized, async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            $or: [
                { owner: req.session.userId },
                { members: req.session.userId }
            ]
        });

        if (!project) {
            return res.status(404).json({ error: 'Projekt nie został znaleziony' });
        }

        await project.removeTask(req.body.groupId, req.params.taskId);
        res.json({ message: 'Zadanie zostało usunięte' });
    } catch (err) {
        console.error('[ERROR] Deleting task failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:id', authorized, async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            owner: req.session.userId
        });

        if (!project) {
            return res.status(404).json({ error: 'Projekt nie został znaleziony' });
        }

        res.json({ message: 'Projekt został usunięty' });
    } catch (err) {
        console.error('[ERROR] Deleting project failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;