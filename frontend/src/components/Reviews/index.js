import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { fetchReviews } from "../../store/reviews";
import DeleteReviewModel from "../DeleteReviewModal";

const Reviews =({ spotId }) => {
    const dispatch = useDispatch()
    const reviews = useSelector(state => state?.review?.Reviews)
    const currentUser = useSelector((state) => state?.session?.user);
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
            
             <div key={review.id} className="rev-contains">
                <p>{review?.User?.firstName}</p>
                <p>{review?.createdAt && new Date(review.createdAt).toLocaleDateString('en-US',{month: 'long', year: 'numeric'})}</p>
             <p>{review?.review}</p>
             {currentUser?.id ===review?.userId &&
             <button>
            <OpenModalMenuItem 
            itemText ='Delete'
            modalComponent={<DeleteReviewModel 
            
            reviewId={review.id}
            spotId={spotId}
            />}
            
            />
            </button>
}
         </div>
            ))}
             </>
    )
    
}


export default Reviews
