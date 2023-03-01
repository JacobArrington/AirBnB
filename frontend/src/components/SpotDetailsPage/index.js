import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotDetail } from "../../store/spots";

const SpotDetails = () =>{
    const { id } = useParams()
    const dispatch = useDispatch()
    const spot = useSelector((state) => state?.spot)
    

    useEffect(() =>{
        dispatch(fetchSpotDetail(id))
    },[dispatch, id])

    //line 16 === lines 18- 20 
    //const detail = spot?.spotDetails?.Spot
    const detail = spot.spotDetails
    if (detail === undefined) return <div> detail not found </div>
    const spotInfo = detail.Spot
   
    console.log(detail,'!!!!!!!!!!!!!!')

    return(
      <div>
        
          
           <h2>{spotInfo.name}</h2>
           <p>{spotInfo.city},{spotInfo.state},{spotInfo.country}</p>
           <div>
           {spotInfo.SpotImages.map(image =>(
            <img key={image.id} src={image.url} alt={spotInfo.name}></img>
           ))}
            </div>
            <p>Hosted by {spotInfo.Owner.firstName} {spotInfo.Owner.lastName}</p>
            <p>{spotInfo.price} night</p>
            <p>{spotInfo.avgStarRating}</p>
            <p>{spotInfo.numReviews}</p>
        
       </div>
    )
}

    
export default SpotDetails
