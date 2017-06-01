import {List} from 'immutable';

let id = 0;
const initialState = { items:List([])}


const reducer = (state=initialState, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
        return {
            ...state,
            items:state.items.push({id:action.itemId,item:action.item,completed:action.completed})
        } 	

    case 'COMPLETED_ITEM':
	  return {
        ...state,
        items:state.items.update( action.itemId-1,(value)=> {
           return {...value,completed:  action.completed}
        })
      }
    case 'INITIAL_ITEMS':
    return {
        ...state,
        items:List(action.items)
      }
	  // return {
    //     ...state,
    //     items:state.items.push({id:action.items.itemId,item:action.items.item,completed:action.items.completed})
    //   }
    default:
      return state
  }
}


export default reducer