// Actions
const SET_SPOTS = 'spots/SET_SPOTS'

export const setSpots = (spots) => {
    return{
        type: SET_SPOTS,
        spots
    }
}

//Thunks
export const fetchSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots');
    const spots = await response.json()
    console.log(response , '!!!!!' , spots)
    dispatch(setSpots(spots))
    //return spots
}



// Reducer and State
const initSpotState = {}

 const spotReducer =(state = initSpotState, action) =>{
    switch(action.type){
        case SET_SPOTS:
            return action.spots
        default:
            return state
    }
}

export default spotReducer;
