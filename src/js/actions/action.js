import axios from "axios"

export const AddItem = (data) => ({
	type: "ADD_ITEM",
	text: data.item,
	itemId:data.id,
	completed:data.completed
})

export const completeItem = (data) => ({
	type: "COMPLETED_ITEM",
	itemId: data.id,
	completed:data.completed
})

export const addNewItem = (id,item) => {
	return (dispatch) => {
		let postData = {
				id:id+1,
				item:item,
				completed:false
		     }
		axios.post("http://localhost:3000/api/additem",postData)
			 .then(res=>{
				dispatch(AddItem(postData))
		     })
	}	
}

export const markItemComplete = (id,completedFlag) => {
	return (dispatch) => {
		let postData = {
				id:id,
				completed:completedFlag
		     }
		axios.post("http://localhost:3000/api/markcomplete",postData)
			 .then(res=>{
				console.dir(res.data.result)
				dispatch(completeItem(postData))
		     })
	}	
}

export const loadInitialData = () => {
	return (dispatch) => {
		axios.get("http://localhost:3000/api/getallitems")
			 .then(res=>{
				console.dir(res.data.result)
				let newArray = res.data.result.map(x=>{return {id:x.itemId, text:x.item,completed:x.completed}})
				dispatch(initialData(newArray))
				})
	}	
}

export const initialData = (res) => ({
	type: "INITIAL_LIST",
	items: res
})