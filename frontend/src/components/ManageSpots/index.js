import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCurrentUserSpots } from "../../store/spots";

function ManageSpots() {
    const dispatch = useDispatch()
   
    const spots = useSelector((state) => Object.values(state.spot))
     //console.log(spots, '!!!!!!!!!!!! 10')

    useEffect(() => {
     
        dispatch(fetchCurrentUserSpots())
     
    },[dispatch])
    const allCurrentSpots = spots
//console.log(allCurrentSpots, '!!!!!!!!!! 18')
    if (!spots.length) {
        return (
            <div>
                <h2>Manage Spots</h2>
                <p>You have not posted any spots yet</p>
                <Link to='/spots/new'>Create New Spot</Link>
            </div>
        )
    }
    return (
        <div>
            <h2>Manage Spots</h2>
            {allCurrentSpots.map((spot) => (
                <div>
                    <Link to={`/spots/current`}>
                        <img src={spots.previewImage} alt={spots.name} />

                    </Link>
                    <p>{spots.city},{spots.state}</p>
                    <p>{spots.price} night</p>
                    <p>{spots.avgRating}</p>
                    <div>
                        <Link to='#'>
                            <button>Update</button>
                        </Link>
                    </div>
                    <div>
                        <Link to='#'>
                            <button>Delete</button>
                        </Link>
                    </div>


                </div>
            ))}
        </div>
    )

}


export default ManageSpots;
