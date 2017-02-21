import React from "react";
import ReactDOM from "react-dom"
import {connect} from 'react-redux'
import {addNewItem,loadInitialData,markItemComplete
	   ,loadInitialDataSocket,addNewItemSocket,markItemCompleteSocket
	   ,AddItem,completeItem} from '../actions/action'
import {List} from "immutable"
import io from "socket.io-client"

import TextField from 'material-ui/TextField'

let socket;
const mapStateToProps = (state = {}) => {
	// console.dir(state)
    return {...state};
};

export  class Layout extends React.Component{
   constructor(props)
   {
	   super(props)
	   const {dispatch} = this.props
	//    dispatch(loadInitialData())
	   socket = io.connect("http://localhost:3000")
	   console.dir(socket)
	   dispatch(loadInitialDataSocket(socket))
	   
	   socket.on('itemAdded',(res)=>{
		   console.dir(res)
		   dispatch(AddItem(res))
	   })

	   socket.on('itemMarked',(res)=>{
		   console.dir(res)
		   dispatch(completeItem(res))
	   })
   }

   componentWillUnmount() {
       socket.disconnect()
	   alert("Disconnecting Socket as component will unmount")
   }

   render(){	
       const {dispatch,items} = this.props
		
		return (
			<div>
				<h1>React TO-DO (Real-Time)</h1>
				<h4>Real-Time To Do using React, Redux, socket.io and Redux-thunk on client and ExpressJs, MongoDb, socket.io on the server side </h4>
                <hr/>
				<TextField 
					hintText="Add New Item"
      				floatingLabelText="Enter the new item"
					ref="newTodo"
				/>
             {/*<input type="text" ref="newTodo"/>*/}
                {" "}
                <button id="click" onClick={ () => {
                        const newItem = ReactDOM.findDOMNode(this.refs.newTodo).value
                        newItem === "" ?  alert("Item shouldn't be blank")
						               :  dispatch(addNewItemSocket(socket,items.size,newItem)) 
									    {/*: dispatch(addNewItem(items.size,newItem))*/}
                        ReactDOM.findDOMNode(this.refs.newTodo).value = ""
					  }
					}>Add new Item!!</button>

				<ul>{items.map((todo,key)=>{
                    return <li key={key} className={todo.completed?"complete-item":""} onClick={ (event) => {
									  {/*dispatch(markItemComplete(key+1,!todo.completed))*/}
									  dispatch(markItemCompleteSocket(socket,key+1,!todo.completed))
									}
								}>{todo.text}
						   </li>})
				}</ul>
				
			</div>
		);
	}
}

export default  connect(mapStateToProps)(Layout)
