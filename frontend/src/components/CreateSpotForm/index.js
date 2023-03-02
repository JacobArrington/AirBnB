import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { postSpot, postSpotImage } from '../../store/spots';
import { csrfFetch } from '../../store/csrf';


function CreateSpotForm() {
     const dispatch = useDispatch()
     const history = useHistory()
    // states
    const [csrfToken, setCsrfToken] = useState('')

     const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 1,
        address: '',
        city: '',
        state: '',
        country: '',
       
     })
     const[spotImages, setSpotImages] = useState({
        previewImage: 'Preview Image URL',
        image1: '',
        image2: '',
        image3: '',
        image4: '',
        
     })

     

     // Change Handlers
    //  useEffect(() => {
    //     async function fetchCsrfToken() {
    //       const response = await csrfFetch('/api/csrf/restore');
    //       const data = await response.json();
    //       setCsrfToken(data.csrfToken);
    //     }
    //     fetchCsrfToken();
    //   }, []);

     const handleInputChange = (e) =>{
        const {name, value} = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,

        }))
     }


     const handleImageChange = async(e) =>{
        const {name, value} = e.target
       
        setSpotImages((prevState) => ({
            ...prevState,
            [name]: value
        }))
     }

    const handleSubmit = async (e) => {
        e.preventDefault()
      const formDataWithImages = new FormData()
     // formDataWithImages.append('previewImage',spotImages.previewImage)
     // formDataWithImages.append('image1',spotImages.image1)
      //formDataWithImages.append('image2',spotImages.image2)
      //formDataWithImages.append('image3',spotImages.image3)
      //formDataWithImages.append('image4',spotImages.image4)
      //console.log(formDataWithImages)
      Object.keys(formData).forEach((key) =>{
        formDataWithImages.append(key,formData[key])
        console.log(key,formData[key])
        
      })
      console.log(formDataWithImages)
      const createdSpot = await dispatch(postSpot(formDataWithImages))

        if(createdSpot){
            const spotId = createdSpot.id 
          Object.keys(spotImages).forEach((key)=>{
            if(key !== 'previewImage' && spotImages[key]){
              dispatch(postSpotImage(spotId, { image: spotImages[key] }));
            }else if (spotImages.previewImage) {
                dispatch(postSpotImage(spotId, { image: spotImages[key], preview: true }));
              }
            
          })
          history.push(`/spots/${spotId}`)
    }
    }
    return (
        <form className="spot-form" onSubmit={handleSubmit}>
             <input type="hidden" name="_csrf" value={csrfToken} />
            <div>
                <h2>Create a new Spot</h2>
                <label>Where's your place located?</label>
                <p>Guests will only get your exact address once they booked a
                    reservation.</p>
            </div>
            <div>
                <label htmlFor="country">Country</label>
                <input
                    type="text"
                    name="country"
                    placeholder='Country' 
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="address">Address</label>
                <input
                    type="text"
                    name='address'
                    placeholder='Address' 
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="city">City</label>
                <input
                    type="text"
                    name="city"
                    placeholder='City' 
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="state">State</label>
                <input
                    type="text"
                    name="state"
                    placeholder='State' 
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
                            placeholder='Please write at least 30 characters' 
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
                           placeholder='Name of your spot' 
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
                            placeholder='Price per night (USD)' 
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                        <div>
                            <label htmlFor='spotImages'>Liven up your spot with photos</label>
                            <p>Submit a link to at least one photo to publish your spot</p>
                            <input 
                                type='text'
                                name='previewImage'
                                placeholder='Preview Image URL'
                                onChange={handleImageChange}
                                required
                            />
                              <input 
                                type='text'
                                name='image1'
                                placeholder='Image URL'
                                onChange={handleImageChange}
                               
                            />
                                <input 
                                type='text'
                                name='image2'
                                placeholder='Image URL'
                                onChange={handleImageChange}
                               
                            />
                                <input 
                                type='text'
                                name='image3'
                                placeholder='Image URL'
                                onChange={handleImageChange}
                               
                            />
                                <input 
                                type='text'
                                name='image4'
                                placeholder='Image URL'
                                onChange={handleImageChange}
                               
                            />

                        </div>
              
            <button type='submit'>Create Spot</button>

        </form>

    )
}



export default CreateSpotForm
