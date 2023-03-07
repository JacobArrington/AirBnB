import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { fetchCurrentUserSpots, removeSpot, setSpots } from "../../store/spots";
import { useHistory } from "react-router-dom";
import { useState } from "react";

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
                <p>Are you sure you want to delete this spot?</p>
                <div className="modal-buttons">
                    <button disabled={isDeleting} onClick={handleYes}>Yes (Delete Spot)</button>
                    <button disabled={isDeleting} onClick={handleNo}>No (Keep Spot)</button>
                </div>
            </div>
        </div>
    )

}

export default DeleteSpotModel
