import { csrfFetch } from "./csrf"

// Actions
const SET_SPOTS = 'spots/SET_SPOTS'
const GET_SPOT_DETAIL = 'spots/GET_SPOT_DETAIL'
const UPDATE_SPOT = 'spots/UPDATE_SPOT'
const ADD_SPOT = 'spots/ADD_SPOT'
const DELETE_SPOT = 'spots/DELETE_SPOT';

export const setSpots = (spots) => {
    return {
        type: SET_SPOTS,
        spots
    }
}

export const updateSpot = (spot) => {
    return {
      type: UPDATE_SPOT,
      spot
    };
  };


const getSpotDetail = (spotDetails) => {
    return {
        type: GET_SPOT_DETAIL,
        spotDetails
    }
}

export const addSpot = (spot) => {
    return {
        type: ADD_SPOT,
        spot
    }
}

export const deleteSpot = (spotId) => {
    return {
      type: DELETE_SPOT,
      spotId,
    };
  };




//Thunks
export const fetchSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots');
    const spots = await response.json()
    //console.log(response , '!!!!!' , spots)
    dispatch(setSpots(spots))
    //return spots
}

export const fetchCurrentUserSpots = () => async (dispatch, getState) => {
    // const ownerId = getState().session.user.id;
    const response = await csrfFetch(`/api/spots/current`)
    const { spots } = await response.json()
    dispatch(setSpots(spots))

}

export const fetchSpotDetail = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}`)
    if (response.ok) {
        const spot = await response.json()
        console.log(spot,'@@@@@@@@ 61')
        console.log(spot.Spot,'@@@@@@@ 71')
        dispatch(getSpotDetail(spot.Spot))
        console.log(spot, `!!!!!!!!!!!!!!!!!!!!! 63`)
    }
}




export const postSpot = (spotData) => async (dispatch) => {
    const { name, description, price, address, city, state, country, images, } = spotData
    //console.log(images)
    const response = await csrfFetch('/api/spots', {
        method: 'POST',

        body: JSON.stringify({ name, description, price, address, city, state, country })
    })
    if (response.ok) {
        const createdSpot = await response.json()
        dispatch(addSpot(createdSpot))
        for await (let image of images) {
            let imageRes = await csrfFetch(`/api/spots/${createdSpot.id}/images`, {
                method: 'POST',
                body: JSON.stringify({ url: image, preview: true })
            })
            if (imageRes.ok) {
                imageRes = await imageRes.json()
                console.log(imageRes)
            }
        }

        return createdSpot
    }
        
}

export const editSpot = (spot) => async (dispatch) =>{
    const response =  await csrfFetch(`/api/spots/${spot.id}`,{
        method: 'PUT',
        body : JSON.stringify(spot)
    })
    const updatedSpot = await response.json()
    dispatch(updateSpot(updatedSpot))

    //return updatedSpot
}

export const removeSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
        const spot = await response.json()
      dispatch(deleteSpot(spot));
    }
  };




// Reducer and State
const initSpotState = {

}

const spotReducer = (state = initSpotState, action) => {
   let newState = {}
    switch (action.type) {

        case SET_SPOTS:
            return { ...state, ...action?.spots };

         case GET_SPOT_DETAIL:
             //  console.log(state)
             //newState = { ...state ,...action.spotDetails};
             // console.log(newState,'!!!!!!!!!!!!!!! 114')
              newState = {...state}
             newState[action.spotDetails.id] = action.spotDetails
             return newState[action.spotDetails.id]

        case ADD_SPOT:
            newState ={...state}
            newState[action?.spot?.id] = action?.spot;
            return newState
         
        case UPDATE_SPOT:
            newState ={...state}
            newState[action?.spot?.id] = action?.spot
            return newState

        case DELETE_SPOT:
            newState = { ...state };
            delete newState[action.spotId.id];
            return newState;
            
        default:
            return state


                
                
                
                
                
               
            
                     
                

                



    }
}

export default spotReducer;
