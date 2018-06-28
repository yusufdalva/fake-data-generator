const express = require('express');
const app = express();
const Person = require('./models/person.js');
const Account = require('./models/account.js');
// database configuration
const dbConfig = require('./config/dbconfig');
const mongoose = require('mongoose');
var faker = require('faker');
faker.locale = "tr";
mongoose.Promise = global.Promise;

// connecting to the database
mongoose.connect(dbConfig.url)
    .then(() => {
        console.log("Successfully connected to the database");
    }).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});
var i;

for(i=0; i<30; i++) {

var id = i;
var name = faker.name.findName();
var _email = faker.internet.email();
var birthday = faker.date.past();


const person = new Person({
    id: id,
    name: name,
    email: _email,
    joinDate: birthday
});

    person.save((err, doc) => { // Yeni oluşturduğumuz satırı işleyelim.
        if (err) {
            console.error(err)
        } else {
            console.log(doc)
        }
    })

  var acc_number = 1 + Math.floor(Math.random() * 4);
    var j;
    for(j=1; j<=acc_number; j++) {

        var iban = faker.finance.iban();
        var balance =  faker.finance.amount();

        const account = new Account({
            id: id,
            iban: iban,
            balance: balance
        })

        account.save((err, doc) => { // Yeni oluşturduğumuz satırı işleyelim.
            if (err) {
                console.error(err)
            } else {
                console.log(doc)
            }
        })
    }

 }



/* simple get
app.get('/', (req, res) => {
    res.json({"message": "Hello there!"});
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});*/
