import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotDetail } from "../../store/spots";

const SpotDetails = () =>{
    const { id } = useParams()
    const dispatch = useDispatch()
    const spots = useSelector((state) => state?.spot)
   //console.log(spots, '!!!!!!!!!!!!!!!! 10', spots.id)

    useEffect(() =>{
        dispatch(fetchSpotDetail(id))
        
    },[dispatch, id])

    let spot = spots.id;
    console.log(spot,'!!!!!!!!!!!!!!!!!!!!!!! 18')
    // if(spots.id){
    //     console.log(spots.id,'@@@@@@@@@@@@@@@@@@@@@@@')
    //     spot = spots.id
    // }

   
    //if (!spot) return <div> detail not found </div>
   // const spotInfo = detail?.Spot
// console.log(spot ,'!!!!!!!!!!!!!!!!! 22')
// console.log(spot.SpotImages, '!!!!!!!!!!!!!!!!!!!! 23')
   
   return(
    <div>
    {spots.id &&(<div>
        
          
        <h2>{spot?.name}</h2>
        <p>{spot?.city},{spot?.state},{spot?.country}</p>
        <div>
     
        {spot.SpotImages && spot?.SpotImages?.map(image =>(
         <img key={image?.id} src={image?.url} alt={spot?.name}></img>
         
        ))}
       
         </div>
         <p>Hosted by {spot?.Owner?.firstName} {spot?.Owner?.lastName}</p>
         <p>{spot?.price} night</p>
         <p>{spot?.avgStarRating }</p>
         <p>{spot?.numReviews ? spot.numReviews : 'New'}</p>
     
    </div>)
    }
      </div>
    )
}

    
export default SpotDetails
