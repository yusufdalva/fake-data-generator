const Person = require('./models/person.js');
const Account = require('./models/account.js');
const Transaction = require('./models/transaction.js');

// database configuration
const dbConfig = require('./config/dbconfig');
const mongoose = require('mongoose');

const faker = require('faker');
faker.locale = "tr";
const fs = require('fs');
mongoose.Promise = global.Promise;


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
let joinDate;
let iban;


// PERSON GENERATOR
// Input: Number of person to generate
function personGenerator(pNumber) {
    console.log("People and accounts are generating...");
    let people = [];
    for(let i=0;i<pNumber; i++) {
        name = faker.name.findName();
        joinDate = faker.date.past();

        const person = new Person({

            name: name,
            joinDate: joinDate
        });

        people.push(person);
    }
    db.collection("people").insertMany(people, function(error, docs) {});


}

function allIds() {
    Person.find().distinct('_id', function(error, ids) {
        accountGenerator(ids);
    });
}
function allIban() {
    Account.find().distinct('iban', function(error, iban) {
        transactionGenerator(iban);
    });
}


function accountGenerator(personId) {
     let accounts = [];
    for(let k=0; k<personId.length; k++  ) {

        let acc_number = 1 + Math.floor(Math.random() * 4);
        let j;
        for (j = 1; j <= acc_number; j++) {

            let iban = faker.finance.iban();
            let balance = faker.finance.amount();

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

async function AddNewData(obj, arr, next) {
    await test.addEdge({
        senderIban: obj.senderIban,
        receiverIban: obj.receiverIban,
        Amount: obj.amount
    });

   await Account.find({iban: obj.senderIban}, function(err,res) {
        test.addVertices({
            TC: res[0].id,
            Iban: res[0].iban,
            Amount: res[0].balance
        });

    });
     await Account.find({iban: obj.receiverIban}, function(err,_res) {
            test.addVertices({
                TC: _res[0].id,
                Iban: _res[0].iban,
                Amount: _res[0].balance
            });
        });

    if (next < 1000) {
        console.log(next);
        AddNewData(arr[next + 1], arr, next + 1);

    }
    else
        ended();
}



async function graphGenerator() {

   Transaction.find(function(err,doc) {

        let i=0;
            AddNewData(doc[i],doc,i);



    });



}

graphGenerator();

function dataViewer() {

}

