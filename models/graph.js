const mongoose = require('mongoose');

const graphSchema = mongoose.Schema({
    graph: {
        mode: String,
        vertices: [
            {
                TC: String,
                iban: String,
                amount: Number
            }
        ],
        edges: [
            {_id: String, senderIban: String, receiverIban: String, amount: Number}
        ]
    }
});

module.exports = mongoose.model('Graph', graphSchema);