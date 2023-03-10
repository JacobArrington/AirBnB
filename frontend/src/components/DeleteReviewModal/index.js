import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";

import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchReviews, removeReview } from "../../store/reviews";
import { fetchSpotDetail } from "../../store/spots";
import './deleteReview.css'

function DeleteReviewModel({ reviewId,spotId }) {
    const { closeModal } = useModal()
    const dispatch = useDispatch();
    const history = useHistory()
    const reviews = useSelector((state) => state.review)
    
    const currentUser = useSelector((state) => state?.session?.user);
    
    console.log(reviews, 'reviews');
    console.log(reviewId, 'reviewId');
     console.log(currentUser, 'currentUser');
    
  

        const currentUserReview= reviews?.Reviews?.find((review)=> review?.user?.id === currentUser?.id && review?.id === reviewId)
       // console.log(currentUserReview, '!!!!!!!!!!!!!!!!!!!!!! 19')
       
        
    
     

        
            const handleDelete= async() =>{
                await dispatch(removeReview(reviewId))
                closeModal()
                await dispatch(fetchReviews(spotId))
                await dispatch(fetchSpotDetail(spotId))
                //console.log(reviewId)
                
            }

            const handleYes =()=>{
                handleDelete(reviewId)
            }

            const handleNo =() =>{
                closeModal()
            }
        
    return (
        <div className='Delete-Modal'>
            
                <h3>Confrim Deletion</h3>
                <p>Are you sure you want to delete this Review?</p>
                
                    <button  onClick={handleYes}className='yes' >Yes (Delete Review)</button>
                    <button  onClick={handleNo} className='no'>No (Keep Review)</button>
                </div>
          
    )

}

export default DeleteReviewModel
