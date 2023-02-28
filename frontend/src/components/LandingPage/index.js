import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../store/spots";


const LandingPage = () => {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state?.spot)

    // const previewImage = Array.isArray(spots) && spots.length > 0
    // ? spots?.filter(spot => spot.preview) : [];
    
    useEffect(() =>{
        dispatch(fetchSpots())
    },[dispatch])

    console.log(spots.Spots)
    const previewImage = spots?.Spots
 console.log(previewImage)
    return(
        <>
        {previewImage?.map(spot => (
    <div key={spot.id}>
        <img src={spot.imageUrl} alt={spot.name} />
       <p>{spot.name}</p>
   </div> ))}

        
        </>
    )
}

export default LandingPage
