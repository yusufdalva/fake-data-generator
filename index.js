const express = require('express');
const app = express();
const Person = require('./models/person.js');
const Account = require('./models/account.js');
const Transaction = require('./models/transaction.js');
/*const Graph = require('./models/graph.js');*/
// database configuration
const dbConfig = require('./config/dbconfig');
const mongoose = require('mongoose');
const faker = require('faker');
faker.locale = "tr";
mongoose.Promise = global.Promise;
let count = 0;
const fs = require('fs');
// connecting to the database
mongoose.connect(dbConfig.url)
    .then(() => {
        console.log("Successfully connected to the database");
    }).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});
let db = mongoose.connection;

let name;
let birthday;
let iban;


// PERSON GENERATOR

function personaccGenerator(pNumber) {
    console.log("People and accounts are generating...");
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
        return iban;
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
            });
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
        });
        transactions.push(transaction);
    }
    // console.log(transactions.length);

    db.collection("transactions").insertMany(transactions, function(error, docs) {});

}



var test = {

    data: {
        mode: "NORMAL",
        vertices: [],
        edges: []
    },
    addVertices: function (x) {
        this.data.vertices.push(x);
    },
    addEdge: function (x) {
        this.data.edges.push(x);
    },
    endOfOperation: function () {
        console.log(this.data);
    }
}

function myWrite(_data) {

    _data = JSON.stringify(_data);
    fs.appendFile('output.json', _data, function (err) {
        if (err) { /* Do whatever is appropriate if append fails*/ }
    });
}

function ended() {
    console.log("vertices:" + test.data.vertices.length);
    console.log("edges:" + test.data.edges.length);
    myWrite(test.data);
}

function AddNewData(obj,arr,next) {
    test.addEdge({
        senderIban: obj.senderIban,
        receiverIban: obj.receiverIban,
        Amount: obj.amount
    });

    Account.find({iban: obj.senderIban}, function(err,res) {
        test.addVertices({
            TC: res[0].id,
            Iban: res[0].iban,
            Amount: res[0].balance
        });

    });
        Account.find({iban: obj.receiverIban}, function(err,_res) {
            test.addVertices({
                TC: _res[0].id,
                Iban: _res[0].iban,
                Amount: _res[0].balance
            });
        });
        if (next < 49999) {
            count++;
            AddNewData(arr[next + 1], arr, next + 1);
        }
        else
            setTimeout(ended, 10000);

}



function graphGenerator() {

    Transaction.find(function(err,doc) {

        var newData = {
            mode: "NORMAL",
            vertices: [],
            edges: []
        }
        var u = 0;
        AddNewData(doc[u],doc,u);
    });

}

graphGenerator();

function dataViewer() {

}

