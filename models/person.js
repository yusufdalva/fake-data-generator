const mongoose = require('mongoose');

const personSchema = mongoose.Schema({
    id: String,
    name: String,
    email: String,
    joinDate: Date

});

module.exports = mongoose.model('Person', personSchema);