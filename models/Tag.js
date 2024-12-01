const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: [75, 'Pole nazwy tagu nie może być dłuższe niż 75 znaków']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.__v;
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.userId;

            ret.createdAt = ret.createdAt.toISOString();

            return ret;
        }
    },
    toObject: {
        transform: function(doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            delete ret.userId;
            return ret;
        }
    }
});

TagSchema.index({ name: 'text', userId: 1 }, { unique: true });

module.exports = mongoose.model('Tag', TagSchema);