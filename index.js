
var exphbs = require('express-handlebars');


//import express from 'express';
//import { engine } from 'express-handlebars';

//import sqlite3 from 'sqlite3'
//import { open } from 'sqlite'

var sqlite3 = require('sqlite3')
var { open } =require ('sqlite')

const dbPromise = open({
  filename: 'data.db',
  driver: sqlite3.Database
})

const path = require("path");

var express = require('express')
var app = express();

app.use(express.static(path.join('http://localhost:8000/', 'views')));
//app.use('/here you put the name of the folder that you JavaScript file is located', express.static(__dirname + 'and here the path to the folder that you JavaScript file is located');

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.static("views"));//considering with index.html, works with rest with link handlers like add.handleres etc. elset starts with home.handles
//with above line reference once fine with localhost reference or direct ./ for views start

app.set('views', './views');

app.use(express.urlencoded())

app.get('/', async (req,res)=>{
    //res.render('home',{messages})
    const db = await dbPromise;
    const messages=await db.all('SELECT * FROM Message;')
    console.log(messages)
    res.render('home',{messages})
})
/*
const messages = [
    'hello world',
    'how are you',
    'hello'
]
*/



app.get('/time',(req,res)=>{
    res.send('the current time is '+(new Date()).toLocaleTimeString())
})

app.post('/update',async(req,res)=>{
    console.log(req.body);
    const db = await dbPromise;
    const from_cutomer_name = req.body.from_customer_name;
    const to_cutomer_name = req.body.to_customer_name;
    const transfer_amount = req.body.transfer_amount;
    //console.log("inside update")
    let data = [transfer_amount, from_cutomer_name];
let sql = `UPDATE Message
            SET balance = balance-?
            WHERE customer_name = ?`;

db.run(sql, data, function(err) {
  if (err) {
    return console.error(err.message);
  }
  
 // console.log(`Row(s) updated: ${this.changes}`);

});

let data1 = [transfer_amount, to_cutomer_name];
let sql1 = `UPDATE Message
            SET balance = balance+?
            WHERE customer_name = ?`;

db.run(sql1, data1, function(err) {
  if (err) {
    return console.error(err.message);
  }
  });
    //await db.run('UPDATE Message(balance,customer_name) set balance=balance-(?) where customer_name=(?)',transfer_amount,from_cutomer_name )
    
    res.redirect('/transaction')
})
app.post('/delete',async(req,res)=>{
    const db=await dbPromise;
    const delete_customer_name=req.body.delete_customer_name;
    await db.run('delete from Message where customer_name=?',delete_customer_name)
    res.redirect('/delete');
    })

app.post('/submit',async(req,res)=>{
    console.log(req.body);
    const db = await dbPromise;
    const customer_name = req.body.customer_name;
    const emailid = req.body.emailid;
    const balance = req.body.balance;
    const city = req.body.city;
    await db.run('INSERT INTO Message (customer_name,emailid,balance,city) VALUES (?,?,?,?);',customer_name,emailid,balance,city)
    //messages.push(messagetext)
    //res.redirect('/')
    
    res.redirect('/add')
})

  //insert into emp values("gddd","dgsd")
  const setup=async()=>{
      const db=await dbPromise
      await db.migrate()
      app.listen(8000,()=>{
          console.log('listening on localhost:8000')
      })
  }
  
  app.get('/customers', async (req,res)=>{
    const db = await dbPromise;
    const messages=await db.all('SELECT * FROM Message;')
    console.log(messages)
    res.render('customers',{messages})
  })

  app.get('/delete', async (req,res)=>{
    const db = await dbPromise;
    const messages=await db.all('SELECT * FROM Message;')
    console.log(messages)
    res.render('delete',{messages})
  })

  app.get('/add', async (req,res)=>{
    const db = await dbPromise;
    const messages=await db.all('SELECT * FROM Message;')
    console.log(messages)
    res.render('add',{messages})
  })

  app.get('/transaction', async (req,res)=>{
    const db = await dbPromise;
    const messages=await db.all('SELECT * FROM Message;')
    console.log(messages)
    res.render('transaction',{messages})
  })


  app.get('/aboutus', async (req,res)=>{
    res.render('aboutus');
  })

  app.get('/login', async (req,res)=>{
    res.render('login');
  })

  app.post('/login_success', async (req,res)=>{
    //res user name, paswed
    ///req.body/username req.body.passwd
    //interact with db if filed , alert and return. keep in same page
    alert("User account not found.")

    //if success. dashboard.handles
    
    //res.redirect('/customers')
  })

  app.use(express.static('public'));

  setup()

  
function sendMoney(){
  var enterName = document.getElementById("enterName").value;
  var enterAmount = parseInt(document.getElementById("enterAmount").value);

  if (enterAmount > 8000) {
     alert("Insufficient Balance.")
  } else {
     var findUserBankAccount = enterName + "BankBalance";
     var finalAmount = parseInt(document.getElementById(findUserBankAccount).innerHTML) + enterAmount;
     var myAccountBalance = parseInt(document.getElementById("myAccountBalance").innerText) - enterAmount
     document.getElementById("myAccountBalance").innerText = myAccountBalance
     document.getElementById(findUserBankAccount).innerHTML = finalAmount;
     alert(`Successful Transaction !!  
     $${enterAmount} is sent to ${enterName}@email.com.`)

     // transaction history 
     var createPTag = document.createElement("li");
     var textNode = document.createTextNode(`$${enterAmount} is sent to recepient with Email-id ${enterName}@email.com on ${Date()}.`);
     createPTag.appendChild(textNode);
     var element = document.getElementById("transaction-history-body");
     element.insertBefore(createPTag, element.firstChild);
  }
}

  //use http://localhost:8000 way