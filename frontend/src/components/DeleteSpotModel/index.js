import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { fetchCurrentUserSpots, removeSpot, setSpots } from "../../store/spots";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import './spotdelete.css';

function DeleteSpotModel({ spotId, handleDelete }) {
    const { closeModal } = useModal()
    const dispatch = useDispatch();
    const history = useHistory()
    const [isDeleting, setIsDeleting] = useState(false);

    const handleYes = () => {
        setIsDeleting(true);
        handleDelete(spotId);
        closeModal();
        history.push('/spots/current')
    };

    const handleNo = () => {
        setIsDeleting(false);
        closeModal()

    }

    return (
        <div className='Modal'>
            <div className='content'>
                <h3>Confrim Deletion</h3>
                <p>Are you sure you want to delete this review?</p>
               
                    <button disabled={isDeleting} onClick={handleYes} className='button-class-yass-mama'>Yes (Delete Review)</button>
                    <button disabled={isDeleting} onClick={handleNo} className='button-class-no-maam'>No (Keep Review)</button>
                
            </div>
        </div>
    )

}

export default DeleteSpotModel
