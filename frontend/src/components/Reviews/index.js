import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchReviews } from "../../store/reviews";

const Reviews =({ spotId }) => {
    const dispatch = useDispatch()
    const reviews = useSelector(state => state?.review?.Reviews)
    console.log(reviews,'!!!!!!!!! 9')

    useEffect(()=>{
        dispatch(fetchReviews(spotId))
    },[dispatch,spotId])
    if(!reviews){
        return <div> be the first to post  a review</div>
    }
    return(
        <>
        {Object.values(reviews).map(review =>(
            
             <div key={review.id}>
             <p>{review?.review}</p>
         </div>
            ))}
       
        </>
    )
}


export default Reviews
