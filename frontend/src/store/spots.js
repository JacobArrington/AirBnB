
import { csrfFetch } from "./csrf";

// Actions
const SET_SPOTS = "spots/SET_SPOTS";
const GET_SPOT_DETAIL = "spots/GET_SPOT_DETAIL";
const ADD_SPOT = "spots/ADD_SPOT";
const ADD_SPOT_IMAGES = "spots/ADD_SPOT_IMAGES";

export const setSpots = (spots) => {
  return {
    type: SET_SPOTS,
    payload: spots,
  };
};

export const fetchSpotDetail = (spotId) => {
  return async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}`);
    if (response.ok) {
      const spotDetails = await response.json();
      dispatch({
        type: GET_SPOT_DETAIL,
        payload: spotDetails,
      });
    }
  };
};

export const postSpot = (spotData) => {
  return async (dispatch) => {
    const response = await csrfFetch("/api/spots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(spotData),
    });
    if (response.ok) {
      const createdSpot = await response.json();
      dispatch({
        type: ADD_SPOT,
        payload: createdSpot,
      });
      return createdSpot;
    }
  };
};

export const postSpotImage = (spotId, images) => {
  return async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ images }),
    });
    if (response.ok) {
      const { spotId, images } = await response.json();
      dispatch({
        type: ADD_SPOT_IMAGES,
        payload: {
          spotId,
          images,
        },
      });
    }
  };
};

export const fetchSpots = () => {
  return async (dispatch) => {
    const response = await fetch("/api/spots");
    if (response.ok) {
      const spots = await response.json();
      dispatch(setSpots(spots));
    }
  };
};

// Reducer and State
const initialState = {
  spots: [],
  spotDetails: null,
  spotImages: {},
};

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPOTS:
      return {
        ...state,
        spots: action.payload,
      };
    case GET_SPOT_DETAIL:
      return {
        ...state,
        spotDetails: action.payload,
      };
    case ADD_SPOT:
      return {
        ...state,
        spots: [...state.spots, action.payload],
      };
    case ADD_SPOT_IMAGES:
      return {
        ...state,
        spotImages: {
          ...state.spotImages,
          [action.payload.spotId]: action.payload.images,
        },
      };
    default:
      return state;
  }
};

export default spotReducer;
