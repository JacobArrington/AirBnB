import { csrfFetch } from "./csrf"

// Actions
const SET_SPOTS = 'spots/SET_SPOTS'
//const GET_SPOT_DETAIL = 'spots/GET_SPOT_DETAIL'
const UPDATE_SPOT = 'spots/UPDATE_SPOT'
const ADD_SPOT_IMAGES = 'spots/ADD_SPOT_IMAGES'

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


// const getSpotDetail = (spotDetails) => {
//     return {
//         type: GET_SPOT_DETAIL,
//         spotDetails
//     }
// }

// export const addSpotSuccess = (spot) => {
//     return {
//         type: ADD_SPOT,
//         spot
//     }
// }



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
        dispatch(updateSpot(spot.Spot))
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
        dispatch(updateSpot(createdSpot))
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







// Reducer and State
const initSpotState = {

}

const spotReducer = (state = initSpotState, action) => {
    switch (action.type) {
        case SET_SPOTS:
            return { ...state, ...action?.spots };
            case UPDATE_SPOT:
                console.log(state)
                const newState = { ...state };
                console.log(newState,'!!!!!!!!!!!!!!! 114')
                
                if (action?.spot) {
                  newState[action?.spot?.id] = action?.spot;
                 console.log(newState,'!!!!!!!!!!!!!!!!!! 118')
                }
                return newState;

                



        default:
            return state
    }
}

export default spotReducer;
