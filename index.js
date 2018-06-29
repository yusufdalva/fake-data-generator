const express = require('express');
const app = express();
const Person = require('./models/person.js');
const Account = require('./models/account.js');
const Transaction = require('./models/transaction.js');
const Graph = require('./models/graph.js');
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
var db = mongoose.connection;
var i;
var id;
var name;
var birthday;
var iban;
var balance;
var userInput;

function personaccGenerator(pNumber) {
console.log("People and accounts are generating...")
    var people = [];
   for(var i=0;i<pNumber; i++) {
       name = faker.name.findName();
       birthday = faker.date.past();

       const person = new Person({

           name: name,
           joinDate: birthday
       });

       people.push(person);
   }
    db.collection("people").insertMany(people, function(error, docs) {});


}

function allIds() {
   Person.find().distinct('_id', function(error, ids) {
        return ids;
    });
}
function allIban() {
    Account.find().distinct('iban', function(error, iban) {
        transactionGenerator(iban);
    });
}

function accountGenerator(personId) {
    var accounts = [];
    for(var k=0; k<personId.length; k++  ) {

        var acc_number = 1 + Math.floor(Math.random() * 4);
        var j;
        for (j = 1; j <= acc_number; j++) {

            var iban = faker.finance.iban();
            var balance = faker.finance.amount();

            const account = new Account({
                id: personId[k],
                iban: iban,
                balance: balance
            })
            accounts.push(account);
        }
    }
    db.collection("accounts").insertMany(accounts, function(error, docs) {});
}

function transactionGenerator(accIban) {
    //console.log(accIban.length);
    var transactions = [];
    for(var t=0;t<200000;t++) {
        var senderIban =  Math.floor(Math.random() * accIban.length);
        var receiverIban =  Math.floor(Math.random() * accIban.length);
        while(senderIban === receiverIban)
        {
            senderIban =  Math.floor(Math.random() * accIban.length);
            receiverIban =  Math.floor(Math.random() * accIban.length);
        }

        var amount = faker.finance.amount();

        const transaction = new Transaction ({
            senderIban: accIban[senderIban],
            receiverIban: accIban[receiverIban],
            amount: amount
        })
        transactions.push(transaction);
    }
   // console.log(transactions.length);

    db.collection("transactions").insertMany(transactions, function(error, docs) {});

}

function graphGenerator(){

    const newData ({
        graph: {
            mode: "NORMAL",
            vertices: [
                {
                    TC: "2023",
                    iban: "1111",
                    amount: "65214"
                },
                {
                    TC: "2023",
                    iban: "2222",
                    amount: "25000"
                }
            ],
            edges: [{
                senderIban: "1111",
                receiverIban: "2222"
            }]
        }
    })

    console.log(JSON.stringify(newData));

}

graphGenerator();
