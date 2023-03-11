import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import reviewReducer from "../../store/reviews";

import { fetchCurrentUserSpots, removeSpot } from "../../store/spots";
import DeleteSpotModel from "../DeleteSpotModel";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";


function ManageSpots() {
    const dispatch = useDispatch();
    const history = useHistory()
    const spots = useSelector((state) => state?.spot)
    const currentUser = useSelector((state) => state?.session?.user);
    const [currentUserSpots, setcurrentUserSpots] = useState([])
  
  
    
    useEffect(() =>{
     
        dispatch(fetchCurrentUserSpots())
    },[dispatch])
    
    
    useEffect(() =>{
      const updatedSpots = spots?.Spots?.filter((spot) => spot?.ownerId === currentUser?.id);
      setcurrentUserSpots(updatedSpots)
    },[spots, currentUser])
        
    const handleDeletedSpot =(spotId) =>{
      
        const updatedSpots = currentUserSpots.filter((spot) => spot.id !== spotId)
        setcurrentUserSpots(updatedSpots)
      }
    
      const handleDelete = async(spotId) => {
        await dispatch(removeSpot(spotId)).then(async() => {
           await dispatch(fetchCurrentUserSpots());
         
          
        });
      };

     
    
    
    return (
  
      <>
       
        { currentUserSpots?.length === 0?(
          
          <div> 
            <h2>Manage Spots</h2>
            you have not created any spots <button><NavLink to='/spots/new'>Create a New Spot</NavLink></button>
          </div> 
         
        ):(
          currentUserSpots?.map((spot) => (
          <div key={spot.id}>
            <h2>Manage Spots</h2>
            <button><NavLink to='/spots/new'>Create a New Spot</NavLink></button>
            <NavLink to={`/spots/${spot.id}`}>
              <img src={spot?.previewImage} alt={spot?.name} />
            </NavLink>
            <p>{spot.city}</p>
            <p>{spot.state}</p>
            <p>{spot.price} night</p>
            <p>{spot.avgRating}</p>
            <div>
              <button type="submit">
                <NavLink to={`/spots/${spot.id}/edit`}>Update</NavLink>
              </button>
            </div>
            <div>
              
              <button >
                
             <OpenModalMenuItem
             itemText='delete'
             modalComponent={<DeleteSpotModel
               spotId ={spot.id}
               handleDelete={handleDelete}
               />}
             />
              </button>
            </div>
          </div>
        )))}
         
      
          
        
      </>
    
      
         
      
      
    );
  }
  

export default ManageSpots;

    
