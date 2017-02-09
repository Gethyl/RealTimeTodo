const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

var Schema = mongoose.Schema;

// create a schema
var toDoSchema = new Schema({
    itemId: Number,
    item: String,
    completed: Boolean
}, {collection:"TodoList"});

// autoincrement plugin is used to increment the itemId
//toDoSchema.plugin(autoIncrement.plugin, { model: 'ToDo', field: 'itemId' }); 
// we need to create a model using it
module.exports = mongoose.model('ToDo', toDoSchema);