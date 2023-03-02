import { csrfFetch } from "./csrf"

// Actions
const SET_SPOTS = 'spots/SET_SPOTS'
const GET_SPOT_DETAIL = 'spots/GET_SPOT_DETAIL'
const ADD_SPOT = 'spots/ADD_SPOT'
const ADD_SPOT_IMAGES = 'spots/ADD_SPOT'
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

export const addSpotSuccess =(spot) =>{
    return{
        type:ADD_SPOT,
        spot
    }
}

export const addSpotImage = (spotImage) =>{
    return{
        type:ADD_SPOT_IMAGES,
        spotImage
    }
}

//Thunks
export const fetchSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots');
    const spots = await response.json()
    //console.log(response , '!!!!!' , spots)
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

export const postSpot =(spotData) => async(dispatch) =>{
    console.log(spotData)
    const response = await csrfFetch('/api/spots',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(spotData)
    })
    if (response.ok){
        const createdSpot = await response.json()
        dispatch(addSpotSuccess(createdSpot))
        console.log(createdSpot)
        return createdSpot
    }
    
}

export const postSpotImage =(spotId, spotImageData) => async(dispatch) =>{
    const response = await csrfFetch(`/api/spots/${spotId}/images`,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spotImageData)
    })
    if(response.ok){
        const createdSpotImage = await response.json()
        console.log(createdSpotImage)
        return createdSpotImage
    }
    
}


// Reducer and State
const initSpotState = {
    spots: [],
    spotDetails: null,
    spotImages:[]
}

 const spotReducer =(state = initSpotState, action) =>{
    switch(action.type){
        case SET_SPOTS:
            return action.spots
        case GET_SPOT_DETAIL:
            return {
                ...state,
                spotDetails: action.spotDetails
            }
        case ADD_SPOT:
            return{
                ...state,
                spots:[...state.spots, action.spot]
                
            }
        case ADD_SPOT_IMAGES:
            return{
                ...state,
                spotImages: [...state.spotImages, action.spotImages]
            }
        default:
            return state
    }
}

export default spotReducer;
