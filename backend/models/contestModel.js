const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    problems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem"
    }],
    start_time: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    submissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Submission"
    }],
    leaderboard: [{
        userName: {
            type: String,
            required: true
        },
        penalty: {
            type: Number,
            default: 0
        },
        numTried: [{
            type: Number,
            default: 0
        }],
        isAccepted: [{
            type: Boolean,
            default: false
        }]
    }]
}, {
    timestamps: true
});

const Contest = mongoose.model('Contest', contestSchema);
module.exports = Contest;