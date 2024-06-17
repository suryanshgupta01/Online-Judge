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
    leaderboard: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        score: {
            type: Number,
            default: 0
        },
        rank: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true
});

const Contest = mongoose.model('Contest', contestSchema);
module.exports = Contest;