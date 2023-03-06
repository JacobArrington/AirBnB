import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouteMatch } from "react-router-dom";
import { fetchSpotDetail } from "../../store/spots";
import { editSpot } from "../../store/spots";
import EditSpotForm from "../EditSpotForm";

const SpotDetails = () =>{
    //const [isLoaded, setIsLoaded] = useState(false)
    const { id } = useParams()
    const dispatch = useDispatch()
    const spot = useSelector((state) => state?.spot)
    const match = useRouteMatch('/spots/:id/edit')
   //console.log(spot, '!!!!!!!!!!!!!!!! 10',spot.id)

    useEffect(() =>{
        dispatch(fetchSpotDetail(id))//.then(()=> setIsLoaded(true))
        
    },[dispatch, id])

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

   
    //if (!spot) return <div> detail not found </div>
   // const spotInfo = detail?.Spot
// console.log(spot ,'!!!!!!!!!!!!!!!!! 22')
// console.log(spot.SpotImages, '!!!!!!!!!!!!!!!!!!!! 23')
   
   return(
    <div>
    {spot &&(<div>
        
          
        <h2>{spot?.name}</h2>
        <p>{spot.city},{spot.state},{spot.country}</p>
        <div>
     
        {spot?.SpotImages && spot?.SpotImages?.map(image =>(
         <img key={image.id} src={image.url} alt={spot.name}></img>
         
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
