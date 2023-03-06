import { useState } from "react";
import { useDispatch } from 'react-redux';
import { editSpot } from "../../store/spots";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";





function EditSpotForm({spot, hideForm}) {
    const dispatch = useDispatch()
    const history = useHistory()
    // states
    const [csrfToken, setCsrfToken] = useState('')


    const [name, setName] = useState(spot.name);
    const [description, setDescription] = useState(spot.description);
    const [price, setPrice] = useState(spot.price);
    const [address, setAddress] = useState(spot.address);
    const [city, setCity] = useState(spot.city);
    const [state, setState] = useState(spot.state);
    const [country, setCountry] = useState(spot.country);





    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'name':
                setName(value)
                break;
            case 'description':
                setDescription(value)
                break;
            case 'price':
                setPrice(value)
                break;
            case 'address':
                setAddress(value)
                break;
            case 'city':
                setCity(value)
                break;
            case 'state':
                setState(value)
                break;
            case 'country':
                setCountry(value)
                break;
            default:
                return




        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('hello gayGod!!!!!!!!!!!!!! from submit')

        const formData = {
            ...spot,
            name,
            description,
            price,
            address,
            city,
            state,
            country,
            
        };
        console.log(formData)
       let updatedSpot =  formData
      console.log(updatedSpot)
        if(updatedSpot){
            await dispatch(editSpot(updatedSpot))
            history.push(`/spots/${updatedSpot.id}`)
            //hideForm()
        }
    }
        return (
            <form className="spot-form" onSubmit={handleSubmit}>
                <input type="hidden" name="_csrf" value={csrfToken} />
                <div>
                    <h2>Edit Spot</h2>
                    <label>Where's your place located?</label>
                    <p>Guests will only get your exact address once they booked a
                        reservation.</p>
                </div>
                <div>
                    <label htmlFor="country">Country</label>
                    <input
                        type="text"
                        name="country"
                        defaultValue={spot?.country}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        name='address'
                        defaultValue={spot?.address}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="city">City</label>
                    <input
                        type="text"
                        name="city"
                        defaultValue={spot?.city}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="state">State</label>
                    <input
                        type="text"
                        name="state"
                        defaultValue={spot?.state}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description">Describe your place to guests</label>
                    <p>Mention the best features of your space, any special amentities like
                        fast wif or parking, and what you love about the neighborhood.</p>
                    <textarea
                        name='description'
                        defaultValue={spot?.description}
                        onChange={handleInputChange}
                        required
                    >
                    </textarea>
                </div>
                <div>
                    <label> Create a title for your spot </label>
                    <p>Catch guests' attention with a spot title that highlights what makes
                        your place special.
                    </p>
                    <input
                        type='text'
                        name="name"
                        defaultValue={spot?.name}
                        onChange={handleInputChange}
                        required

                    />



                </div>

                <div>
                    <label htmlFor="price">Set a base price for your spot</label>
                    <p>Competitive pricing can help your listing stand out and rank higher
                        in search results</p>
                    <input
                        type="number"
                        name="price"
                        defaultValue={spot?.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>
               

                <button type ='submit'>
            <NavLink to={`/spots/${spot.id}`}>
              
            </NavLink>
            Update
        </button>

            </form>

        )
    }



export default EditSpotForm
