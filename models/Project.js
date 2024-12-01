const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    id: String,
    content: String,
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const PositionSchema = new mongoose.Schema({
    offset: {
        left: Number,
        top: Number
    },
    position: {
        left: Number,
        top: Number
    },
    left: Number,
    top: Number
});

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tasks: {
        todo: [TaskSchema],
        inprogress: [TaskSchema],
        done: [TaskSchema]
    },
    positions: {
        type: Map,
        of: PositionSchema,
        default: new Map()
    }
}, {
    timestamps: true
});

ProjectSchema.methods.updatePositions = async function(posBuffer) {
    try {
        posBuffer.forEach(pos => {
            const groupId = Object.keys(pos)[0];
            this.positions.set(groupId, pos[groupId]);
        });
        return await this.save();
    } catch (error) {
        throw error;
    }
};

ProjectSchema.methods.moveTask = async function(taskId, toGroup) {
    try {
        let task;
        let fromGroup;

        for (const [groupId, tasks] of Object.entries(this.tasks)) {
            const foundTask = tasks.find(t => t.id === taskId);
            if (foundTask) {
                task = foundTask;
                fromGroup = groupId;
                break;
            }
        }

        if (!task) throw new Error('Task not found');

        this.tasks[fromGroup] = this.tasks[fromGroup].filter(t => t.id !== taskId);
        this.tasks[toGroup].push(task);

        return await this.save();
    } catch (error) {
        throw error;
    }
};

ProjectSchema.methods.addTask = async function(groupId, taskData) {
    try {
        if (!this.tasks[groupId]) throw new Error('Invalid group');

        const newTask = {
            id: Date.now().toString(),
            content: taskData.content,
            priority: taskData.priority || 'medium',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.tasks[groupId].push(newTask);
        await this.save();
        return newTask.id;
    } catch (error) {
        throw error;
    }
};

ProjectSchema.methods.removeTask = async function(groupId, taskId) {
    try {
        if (!this.tasks[groupId]) throw new Error('Invalid group');

        this.tasks[groupId] = this.tasks[groupId].filter(t => t.id !== taskId);
        return await this.save();
    } catch (error) {
        throw error;
    }
};

ProjectSchema.statics.getUserProjects = async function(userId) {
    try {
        return await this.find({
            $or: [
                { owner: userId },
                { members: userId }
            ]
        }).sort({ updatedAt: -1 });
    } catch (error) {
        throw error;
    }
};

module.exports = mongoose.model('Project', ProjectSchema);