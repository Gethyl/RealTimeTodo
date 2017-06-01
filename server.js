const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const autoIncrement = require('mongoose-auto-increment')
const http = require('http')
const socketServer =require('socket.io')
const path = require('path')

const app = express();

const todoModel = require('./models/todoModel')  //todo model

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// MONGOOSE CONNECT - to change the local port for Heroku
// ===========================================================================
mongoose.connect('mongodb://localhost:27017/local')

var db = mongoose.connection
db.on('error', ()=> {console.log( '---Gethyl FAILED to connect to mongoose')})
db.once('open', () => {
	console.log( '+++Gethyl connected to mongoose+++')
})

var serve = http.createServer(app);
var io = socketServer(serve);
const port = process.env.PORT || 3000
serve.listen(port,()=> {console.log(`+++Gethyl Express Server with Socket Running on ${port}!!!`)})

const indexPath = path.join(__dirname, './index.html')
const distPath = express.static(path.join(__dirname, './dist'))

app.use('/dist', distPath)
app.get('/', function (req, res) { res.sendFile(indexPath) })
/***************************************************************************************** */
/* Socket logic starts here																   */
/***************************************************************************************** */
const connections = [];
io.on('connection', function (socket) {
	console.log("Connected to Socket!!"+ socket.id)	
	connections.push(socket)
	socket.on('disconnect', function(){
		console.log('Disconnected - '+ socket.id);
	});

	var cursor = todoModel.find({},"-_id itemId item completed",(err,result)=>{
				if (err){
					console.log("---Gethyl GET failed!!")
				}
				else {
					socket.emit('initialList',result)
					console.log("+++Gethyl GET worked!!")
				}
			})
	// 		.cursor()
	// cursor.on('data',(res)=> {socket.emit('initialList',res)})
	
	socket.on('addItem',(addData)=>{
		var todoItem = new todoModel({
			itemId:addData.id,
			item:addData.item,
			completed: addData.completed
		})

		todoItem.save((err,result)=> {
			if (err) {console.log("---Gethyl ADD NEW ITEM failed!! " + err)}
			else {
				// connections.forEach((currentConnection)=>{
				// 	currentConnection.emit('itemAdded',addData)
				// })
				io.emit('itemAdded',addData)
				
				console.log({message:"+++Gethyl ADD NEW ITEM worked!!"})
			}
		})
	})

	socket.on('markItem',(markedItem)=>{
		var condition   = {itemId:markedItem.id},
			updateValue = {completed:markedItem.completed}

		todoModel.update(condition,updateValue,(err,result)=>{
			if (err) {console.log("---Gethyl MARK COMPLETE failed!! " + err)}
			else {
				// connections.forEach((currentConnection)=>{
				// 	currentConnection.emit('itemMarked',markedItem)
				// })
				io.emit('itemMarked',markedItem)

				console.log({message:"+++Gethyl MARK COMPLETE worked!!"})
			}
		})
	})
	
});