const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    senderIban: String,
    receiverIban: String,
    amount: Number

});

module.exports = mongoose.model('Transaction', transactionSchema);