const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    id: String,
    iban: String,
    balance: Number

});

module.exports = mongoose.model('Account', accountSchema);