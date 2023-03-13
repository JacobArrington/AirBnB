import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../store/spots";
import { NavLink } from 'react-router-dom';
import './landingPage.css' 
import Tooltip from "../ToolTip";


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
 //console.log(previewImage)
 return (
    <div className='container'>
      {previewImage?.map(spot => (
        <div key={spot.id} className='card'>
          <NavLink to={`/spots/${spot.id}`}>
            <div className="img-container">
              <Tooltip spotName={spot.name}>
                <img src={spot?.previewImage} alt={spot?.name} />
              </Tooltip>
            </div>
            <div className="info">
              <div className="location">
                <p>{spot.city}, {spot.state}</p>
              </div>
              <div className="star">
                <p><i class="fa-solid fa-star"></i>{spot.avgRating}</p>
              </div>
            </div>
            <div className="price">
              <p>${spot.price} night</p>
            </div>
          </NavLink>
        </div>
      ))}
    </div>
  );
      }
export default LandingPage
