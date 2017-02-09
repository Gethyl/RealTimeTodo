import React from "react";
import ReactDOM from "react-dom"
import {connect} from 'react-redux'
import {addNewItem,loadInitialData,markItemComplete
	   ,loadInitialDataSocket,addNewItemSocket,AddItem} from '../actions/action'
import {List} from "immutable"
import io from "socket.io-client"

let socket;
const mapStateToProps = (state = {}) => {
	// console.dir(state)
    return {...state};
};

export  class Layout extends React.Component{
   constructor(props)
   {
	   super(props)
   }

   componentWillMount() {
	   //this.props.dispatch(loadInitialData())
   	   socket = io.connect("http://localhost:3000")
	   console.dir(socket)
	   this.props.dispatch(loadInitialDataSocket(socket))
	   socket.on('itemAdded',(res)=>{
		   console.dir(res)
		   this.props.dispatch(AddItem(res))
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
				<h1>React TO-DO</h1>
                <hr/>
                <input type="text" ref="newTodo"/>
                {" "}
                <button id="click" onClick={ () => {
                        const newItem = ReactDOM.findDOMNode(this.refs.newTodo).value
                        newItem === "" ?  alert("Item shouldn't be blank")
						               :  dispatch(addNewItemSocket(socket,items.size,newItem)) 
                        ReactDOM.findDOMNode(this.refs.newTodo).value = ""
					  }
					}>Add new Item!!</button>

				<ul>{items.map((todo,key)=>{
                    return <li key={key} className={todo.completed?"complete-item":""} onClick={ (event) => {
									  dispatch(markItemComplete(key+1,!todo.completed))
									}
								}>{todo.text}
						   </li>})
				}</ul>
				
			</div>
		);
	}
}

export default  connect(mapStateToProps)(Layout)
