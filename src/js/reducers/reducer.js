import {List} from 'immutable';

let id = 0;
const initialState = { items:List([])}


const reducer = (state=initialState, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
       let newList = state.items.push({id:action.itemId,text:action.text,completed:action.completed})
        return {
            ...state,
            items:state.items.push({id:action.itemId,text:action.text,completed:action.completed})
        } 	

    case 'COMPLETED_ITEM':
	  return {
        ...state,
        items:state.items.update( action.itemId,(value)=> {
           return {...value,completed:  action.completed}
        })
      }
    case 'INITIAL_LIST':
	  return {
        ...state,
        items:List(action.items)
      }
    default:
      return state
  }
}


export default reducer