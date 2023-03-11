import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";

import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchReviews, removeReview } from "../../store/reviews";

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
                console.log(reviewId)
                
            }

            const handleYes =()=>{
                handleDelete(reviewId)
            }

            const handleNo =() =>{
                closeModal()
            }
        
    return (
        <div className='Modal'>
            <div className='content'>
                <h3>Confrim Deletion</h3>
                <p>Are you sure you want to delete this Review?</p>
                <div className="modal-buttons">
                    <button  onClick={handleYes}>Yes (Delete Review)</button>
                    <button  onClick={handleNo}>No (Keep Review)</button>
                </div>
            </div>
        </div>
    )

}

export default DeleteReviewModel
