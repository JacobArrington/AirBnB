import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../store/spots";
import { NavLink } from 'react-router-dom';


const LandingPage = () => {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state?.spot)

    // const previewImage = Array.isArray(spots) && spots.length > 0
    // ? spots?.filter(spot => spot.preview) : [];
    
    useEffect(() =>{
        dispatch(fetchSpots())
    },[dispatch])

    //console.log(spots.Spots)
    const previewImage = spots?.Spots
 console.log(previewImage)
    return(
        <>
        {previewImage?.map(spot => (
    <div key={spot.id}>
        <NavLink  to={`/spots/${spot.id}`}>
        <img src={spot.previewImage} alt={spot.name} />
       <p>{spot.city }</p>
       <p>{spot.state}</p>
       <p>{spot.price} night</p>
       <p>{spot.avgRating}</p>
       </NavLink>
       
   </div> ))}

        
        </>
    )
}

export default LandingPage
