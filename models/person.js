const mongoose = require('mongoose');

const personSchema = mongoose.Schema({
    id: String,
    name: String,
    email: String,
    joinDate: Date

}, {
    timestamps: true // mongoDB creates createdAt and updatedAt auto
});

module.exports = mongoose.model('Person', personSchema);