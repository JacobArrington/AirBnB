import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { postReview } from "../../store/reviews"
import { useModal } from "../../context/Modal";
import { fetchSpotDetail } from "../../store/spots";



const PostReviewModal =({spotId}) =>{
    const dispatch = useDispatch()
    const { closeModal } = useModal()
    const [review, setReview] = useState('')
    const [stars, setStars] = useState(0)

    const handleInputChange = (e) =>{
        const {name, value} = e.target;
        switch(name){
            case 'review':
                setReview(value)
                break;
            case 'stars':
                setStars(value)
                break;
            default:
                return
        }
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()

        const formData = {
            review,
            stars,
            spotId
        }
        const newReview = await dispatch(postReview(formData))
        closeModal()
        //await dispatch(fetchSpotDetail())
        return newReview
        
        
    }
    return(
        <>
        <form className='review-modal' onSubmit={handleSubmit}>
        <h2> How was your stay</h2>
        <input
            type='text'
            name='review'
            placeholder="Leave your review here"
            onChange={handleInputChange}
            required
        
        />
        <input
        type='number'
        name = 'stars'
        onChange={handleInputChange}
        required
        />

<button type='submit'>Submit Your Review</button>
        </form>
        
                
        </>
    )

}
 export default PostReviewModal
