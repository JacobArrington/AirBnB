import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouteMatch } from "react-router-dom";
import { fetchReviews } from "../../store/reviews";
import { fetchSpotDetail } from "../../store/spots";
import { editSpot } from "../../store/spots";
import FetchReviews from "../Reviews";
import EditSpotForm from "../EditSpotForm";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import PostReviewModal from "../PostReviewModal";
import DeleteReviewModel from "../DeleteReviewModal";
import './SpotDetailsPage.css'

const SpotDetails = () =>{
    //const [isLoaded, setIsLoaded] = useState(false)
    const { id } = useParams()
    const dispatch = useDispatch()
    const spot = useSelector((state) => state?.spot)
    const reviews = useSelector((state)=> state.review)
    const currentUser = useSelector((state) => state?.session?.user);
    const match = useRouteMatch('/spots/:id/edit')
    console.log(reviews)
    
   //console.log(spot, '!!!!!!!!!!!!!!!! 10',spot.id)
  

    useEffect(() =>{
        dispatch(fetchSpotDetail(id))
        dispatch(fetchReviews(id))
       
      
        
    },[dispatch, id, ])

    if(match){
        //dispatch(editSpot(spot))
        return <EditSpotForm spot={spot} />
    }

   //let spot = Object.values(spots)[1]
    //console.log(spot,'!!!!!!!!!!!!!!!!!!!!!!! 18')
    // if(spots.id){
    //     console.log(spots.id,'@@@@@@@@@@@@@@@@@@@@@@@')
    //     spot = spots.id
    // }

 const spotOwner = currentUser && spot && currentUser.id === spot.ownerId
   
    //if (!spot) return <div> detail not found </div>
   // const spotInfo = detail?.Spot
// console.log(spot ,'!!!!!!!!!!!!!!!!! 22')
// console.log(spot.SpotImages, '!!!!!!!!!!!!!!!!!!!! 23')
   
   return(
    <div>
    {spot &&(<div className="spot-detail-container">
        
          <div className="spot-info">
        <h2>{spot.name}</h2>
        <p>{spot.city},{spot.state},{spot.country}</p>
        </div>
        <div className="spot-img">
     
        {spot?.SpotImages && spot.SpotImages.map(image =>(
         <img key={image.id} src={image.url} alt={spot.name}></img>
         
        ))}
        <div className="spot-descript">
            <p>{spot.description}</p>
        </div>
       
         </div>
         <div className="owner">
         <p>Hosted by {spot?.Owner?.firstName} {spot?.Owner?.lastName}</p>
         </div>
            <div className="booking">
                
                <div className ="book-price">
         <p>${spot.price} night</p>
                </div>
                <div class='book-star'>
         <p><i class="fa-solid fa-star"></i>{spot.avgStarRating }</p>
                </div>
            <div className="book-review-count" >
         <p>{spot.numReviews ? spot.numReviews : 'New'}</p>
            </div>
            <div btn-div>
         <button className="RSVP-btn">Reserve</button>
            </div>
            </div>
               <div className="review-container" >     
            <div className="review-stats">
            <div className="review-star"><p><i class="fa-solid fa-star"></i>{spot.avgStarRating }</p></div> 
            <div className="review-count"><p>{spot.numReviews ? spot.numReviews : 'New'} reviews</p></div> 
            </div>
        {(!currentUser || spotOwner) || (
         <button className="post-review-btn">
            <OpenModalMenuItem
             itemText='Post Your Review'
             modalComponent={<PostReviewModal 
             spotId={id}
             />}
            
            />
         </button>
        )}
        </div>
         
         
         <FetchReviews spotId={id} />
     
     <div>
        
        
       
     </div>
    </div>
        
    
    
    )
    }
      </div>
    )
}

    
export default SpotDetails
