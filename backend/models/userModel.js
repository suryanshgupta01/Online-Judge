const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userid: {
        type: String,
        required: true,
        unique: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    problem_rating: {
        type: Number,
        default: 0
    },
    contest_rating: {
        type: Number,
        default: 0
    },
    problems_submitted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem"
    }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;