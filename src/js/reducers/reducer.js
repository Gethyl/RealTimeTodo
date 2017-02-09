import {List} from 'immutable';

let id = 0;
const initialState = { items:List([])}


const reducer = (state=initialState, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
        // let newList = state.items.push({id:id++,text:action.item,completed:false})
        return {
            ...state,
            items:state.items.push({id:id++,text:action.item,completed:false})
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
        items:action.items
      }
    default:
      return state
  }
}


export default reducer