import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { fetchCurrentUserSpots, removeSpot, setSpots } from "../../store/spots";
import { useHistory } from "react-router-dom";

function DeleteSpotModel({ spotId, handleDeletedSpot }) {
    const { closeModal } = useModal()
    const dispatch = useDispatch();
    const history = useHistory()

    const handleDeleteSpot = (spotId) => {
        dispatch(removeSpot(spotId)).then(() => {
            dispatch(fetchCurrentUserSpots()).then(() => {
                handleDeletedSpot(spotId);
                closeModal()
            });
        });
    };

    const handleCancel = () => {
        closeModal()

    }

    return (
        <div className='Modal'>
            <div className='content'>
                <h3>Confrim Deletion</h3>
                <p>Are you sure you want to delete this spot?</p>
                <div className="modal-buttons">
                    <button onClick={handleDeleteSpot}>Yes (Delete Spot)</button>
                    <button onClick={handleCancel}>No (Keep Spot)</button>
                </div>
            </div>
        </div>
    )

}

export default DeleteSpotModel
