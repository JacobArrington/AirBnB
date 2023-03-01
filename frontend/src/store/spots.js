// Actions
const SET_SPOTS = 'spots/SET_SPOTS'
const GET_SPOT_DETAIL = 'spots/GET_SPOT_DETAIL'

export const setSpots = (spots) => {
    return{
        type: SET_SPOTS,
        spots
    }
}
const getSpotDetail =(spotDetails) =>{
    return {
        type: GET_SPOT_DETAIL,
        spotDetails
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

export const fetchSpotDetail = (spotId) => async(dispatch) =>{
    const response = await fetch(`/api/spots/${spotId}`)
    if(response.ok){
    const spotDetail = await response.json()
    dispatch(getSpotDetail(spotDetail))
    }
}

// Reducer and State
const initSpotState = {}

 const spotReducer =(state = initSpotState, action) =>{
    switch(action.type){
        case SET_SPOTS:
            return action.spots
        case GET_SPOT_DETAIL:
            return {
                ...state,
                spotDetails: action.spotDetails
            }
        default:
            return state
    }
}

export default spotReducer;
