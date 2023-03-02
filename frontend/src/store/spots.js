import { csrfFetch } from "./csrf"

// Actions
const SET_SPOTS = 'spots/SET_SPOTS'
const GET_SPOT_DETAIL = 'spots/GET_SPOT_DETAIL'
const ADD_SPOT = 'spots/ADD_SPOT'
const ADD_SPOT_IMAGES = 'spots/ADD_SPOT_IMAGES'
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

export const addSpotImage = (spotId, images) =>{
    return{
        type:ADD_SPOT_IMAGES,
        spotId,
        images,
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

export const postSpotImage = (spotId, imageUrls) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrls }),
    });
    if (response.ok) {
      const { images } = await response?.json();
      dispatch(addSpotImage(spotId, images));
    }
  };
  
  
  


// Reducer and State
const initSpotState = {
    spots: [],
    spotDetails: null,
    spotImages:[]
}

 const spotReducer =(state = initSpotState, action) =>{
    switch(action.type){
        case SET_SPOTS:
            return action?.spots
        case GET_SPOT_DETAIL:
            return {
                ...state,
                spotDetails: action?.spotDetails
            }
        case ADD_SPOT:
            return{
                ...state,
                spots:[...state?.spots, [action?.spots]],
                spotImages:{
                    ...state?.spotImages,
                    [action?.spots?.id]: action.spots?.images
                },
                
            }
            case ADD_SPOT_IMAGES:
  const spotId = action?.payload?.spotId;
  const newImages = action?.payload?.images;
  return {
    ...state,
    Spots: state?.spots?.map((spot) => {
      if (spot.id === spotId) {
        return {
          ...state?.spots,
          images: [...spot?.images, ...newImages],
        };
      }
      return spot;
    }),
  };
      
        default:
            return state
    }
}

export default spotReducer;
