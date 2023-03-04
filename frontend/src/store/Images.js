

const ADD_SPOT_IMAGES = 'spots/ADD_SPOT_IMAGES'

export const addSpotImage = (image) =>{
    return{
        type: ADD_SPOT_IMAGES,
        image
    }
}
const initState = {
    images:[]
}
const imageReducer = (state = initState , action) =>{
    switch(action.type){
        case ADD_SPOT_IMAGES:
            return{
                ...state,
                images: [state?.images, action?.payload]
                
            }
            default: 
            return state;
    }

}

export default imageReducer
