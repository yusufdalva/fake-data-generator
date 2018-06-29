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
var db = mongoose.connection;
var i;
var id;
var name;
var birthday;
var iban;
var balance;
function personaccGenerator() {
console.log("People and accounts are generating...")
    var people = [];
   for(var i=0;i<30000; i++) {
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
personaccGenerator();
