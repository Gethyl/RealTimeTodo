import React from "react";
import ReactDOM from "react-dom"
import {connect} from 'react-redux'
import {AddItem,CompleteItem,loadInitialData} from '../actions/action'
import {List} from "immutable"

const mapStateToProps = (state = {}) => {
    return {...state};
};

export  class Layout extends React.Component{
   constructor(props)
   {
	   super(props)
	   this.props.dispatch(loadInitialData())
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
                        newItem === "" ?  alert("Item shouldn't be blank"): dispatch(AddItem(newItem)) 
                        ReactDOM.findDOMNode(this.refs.newTodo).value = ""
					  }
					}>Add new Item!!</button>

				<ul>{items.map((todo,key)=>{
                    return <li key={key} className={todo.completed?"complete-item":""} onClick={ (event) => {
									  dispatch(CompleteItem(key,!todo.completed))
									}
								}>{todo.text}
						   </li>})
				}</ul>
				
			</div>
		);
	}
}

export default  connect(mapStateToProps)(Layout)
