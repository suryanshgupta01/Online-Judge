const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    constraints: {
        type: String,
        required: true
    },
    solved_TC: {
        type: String
    },
    all_TC: [{
        type: String
    }],
    all_correct_soln: [{
        type: String
    }],
    rating: {
        type: Number,
        required: true
    },
    submitted_by: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    total_submissions: {
        type: Number,
        default: 0
    },
    total_accepted: {
        type: Number,
        default: 0
    },
    hidden: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;