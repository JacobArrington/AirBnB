import { csrfFetch } from "./csrf";


//acitons
export const GET_REVIEWS = 'reviews/GET_REVIEWS' 

export const getReviews =(review) => {
    return {
        type: GET_REVIEWS,
        review,
        
    }
}
//thunks
export const fetchReviews = (spotId) => async(dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/reviews`)
    const reviews = await response.json()
    console.log(reviews, '!!!!!! 18')
    dispatch(getReviews(reviews))
    console.log(reviews,'!!!!!!!!!!!!!!! 20')
}

const initReviewState = {}

const reviewReducer = (state = initReviewState, action) =>{
    let newState ={}
    switch (action.type){
        case GET_REVIEWS:
            console.log(action.review)
            newState ={...state, ...action.review}
            console.log(newState)
            return newState

    default: 
        return state
    }
}


export default reviewReducer
