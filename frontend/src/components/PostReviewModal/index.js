import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchReviews, postReview } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { fetchSpotDetail } from "../../store/spots";

const PostReviewModal = ({ spotId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "review":
        setReview(value);
        break;
      case "stars":
        setStars(parseInt(value));
        break;
      default:
        return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      review,
      stars,
      spotId,
    };
    const newReview = await dispatch(postReview(formData));
    closeModal();
    await dispatch(fetchReviews(spotId));
    await dispatch(fetchSpotDetail(spotId));
    return newReview;
  };

  return (
    <>
      <form className="review-modal" onSubmit={handleSubmit}>
        <h2>How was your stay?</h2>
        <input
          type="text"
          name="review"
          placeholder="Leave your review here"
          onChange={handleInputChange}
          required
        />
        <div className="star-rating">
          <input
            type="radio"
            id="star-5"
            name="stars"
            value="1"
            onChange={handleInputChange}
            required
          />
          <label htmlFor="star-5">
            <i className="fas fa-star"></i>
          </label>
          <input
            type="radio"
            id="star-4"
            name="stars"
            value="2"
            onChange={handleInputChange}
            required
          />
          <label htmlFor="star-4">
            <i className="fas fa-star"></i>
          </label>
          <input
            type="radio"
            id="star-3"
            name="stars"
            value="3"
            onChange={handleInputChange}
            required
          />
          <label htmlFor="star-3">
            <i className="fas fa-star"></i>
          </label>
          <input
            type="radio"
            id="star-2"
            name="stars"
            value="4"
            onChange={handleInputChange}
            required
          />
          <label htmlFor="star-2">
            <i className="fas fa-star"></i>
          </label>
          <input
            type="radio"
            id="star-1"
            name="stars"
            value="5"
            onChange={handleInputChange}
            required
          />
          <label htmlFor="star-1">
            <i className="fas fa-star"></i>
          </label>
        </div>
        <button className="review" type="submit">
          Submit Your Review
        </button>
      </form>
    </>
  );
};

export default PostReviewModal;
