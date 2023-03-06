import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { fetchCurrentUserSpots } from "../../store/spots";

function ManageSpots() {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state?.spot)
    const currentUser = useSelector((state) => state?.session?.user);
    

    const currentUserSpots = spots?.Spots?.filter((spot) => spot?.ownerId === currentUser?.id);
    
    useEffect(() =>{
        dispatch(fetchCurrentUserSpots())
    },[dispatch])

    //console.log(spots.Spots)
  
    return(
        <>
        {currentUserSpots?.map(spot => (
    <div key={spot.id}>
        <NavLink  to={`/spots/${spot.id}`}>
        <img src={spot?.previewImage} alt={spot?.name} />
       </NavLink>
       <p>{spot.city }</p>
       <p>{spot.state}</p>
       <p>{spot.price} night</p>
       <p>{spot.avgRating}</p>
       <div>
                       
       <button type = 'submit'>
            <NavLink to={`/spots/${spot.id}/edit`}>
              Update
            </NavLink>
        </button>
                        
            </div>
                    <div>
                        
                            <button>Delete</button>
                        
                    </div>
       
   </div> ))}
   
   </>
    )
}

export default ManageSpots;
