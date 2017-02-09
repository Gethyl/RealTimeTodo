import axios from "axios"

export const AddItem = (item) => ({
	type: "ADD_ITEM",
	item: item
})

export const CompleteItem = (id, completedFlag) => ({
	type: "COMPLETED_ITEM",
	itemId: id,
	completed:completedFlag
})

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