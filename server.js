const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const autoIncrement = require('mongoose-auto-increment')

const app = express();

const todoModel = require('./models/todoModel')  //todo model

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// MONGOOSE CONNECT
// ===========================================================================
mongoose.connect('mongodb://localhost:27017/local')

var db = mongoose.connection
db.on('error', ()=> {console.log( '---Gethyl FAILED to connect to mongoose')})
db.once('open', () => {
	console.log( '+++Gethyl connected to mongoose')
})

// autoIncrement.initialize(db)

// todoModel.schema.plugin(autoIncrement.plugin, { model: 'ToDo', field: 'itemId' })

// ROUTES FOR OUR API
// ===========================================================================
var router = express.Router()

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    console.log('+++Gethyl entering the middleware');
    next(); // make sure we go to the next routes and don't stop here
});

router.route('/')
		.get((req,res)=>{
			todoModel.find((err,result)=>{
				if (err){res.json({message:"---Gethyl GET worked!!",err:err})}
				else res.json({message:"+++Gethyl GET worked!!",result:result})
			})
		  });
		  
router.route('/getallitems')
		.get((req,res)=>{
			todoModel.find({},"-_id itemId item completed",(err,result)=>{
				if (err){res.json({message:"---Gethyl GET worked!!",err:err})}
				else {
					res.json({message:"+++Gethyl GET worked!!",result:result})
				}
			})
		  });

router.route('/additem')
		.post((req,res)=>{
			
			var todoItem = new todoModel({
				itemId:req.body.id,
				item:req.body.item,
				completed: req.body.completed
			})

			todoItem.save((err,result)=> {
				if (err) {res.send("---Gethyl ADD NEW ITEM failed!! " + err)}
				else res.json({message:"+++Gethyl ADD NEW ITEM worked!!",result:result})
			})
	    });
		
router.route('/markcomplete')
		.post((req,res)=>{
			var condition   = {itemId:req.body.id},
			    updateValue = {completed:req.body.completed}

			todoModel.update(condition,updateValue,(err,result)=>{
				if (err){res.json({message:"---Gethyl MARKED COMPLETE failed!!",err:err})}
				else {
					res.json({message:"+++Gethyl MARKED COMPLETE worked!!",result:result})
				}
			})
		  });

// further routes goes here

app.use('/api',router)

app.listen(3000,()=> {console.log("+++Gethyl Express Running!!!")})
