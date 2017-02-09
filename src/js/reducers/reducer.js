import {List} from 'immutable';

let id = 0;
const initialState = { items:List([])}


const reducer = (state=initialState, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
        return {
            ...state,
            items:state.items.push({id:action.itemId,text:action.text,completed:action.completed})
        } 	

    case 'COMPLETED_ITEM':
	  return {
        ...state,
        items:state.items.update( action.itemId-1,(value)=> {
           return {...value,completed:  action.completed}
        })
      }
    case 'INITIAL_LIST':
	  return {
        ...state,
        items:List(action.items)
      }
    case 'INITIAL_ITEMS':
	  return {
        ...state,
        items:state.items.push({id:action.items.itemId,text:action.items.item,completed:action.items.completed})
      }
    default:
      return state
  }
}


export default reducer