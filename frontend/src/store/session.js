import { csrfFetch } from './csrf';

// Action types
const SET_SESSION_USER = 'session/setSessionUser';
const REMOVE_SESSION_USER = 'session/removeSessionUser';

// Action creators
const setSessionUser = (user) => ({
    type: SET_SESSION_USER,
    payload: user,
  });
  
  const removeSessionUser = () => ({
    type: REMOVE_SESSION_USER,
  });
  
  // Thunk action creator
  export const login = ({ credential, password }) => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
      method: 'POST',
      body: JSON.stringify({ credential, password }),
    });
    const data = await response.json();
    dispatch(setSessionUser(data.user));
  };

// Initial state
const initialState = {
  user: null,
};

// Reducer
const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION_USER:
      return {
        ...state,
        user: action.payload,
      };
    case REMOVE_SESSION_USER:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};



// Export reducer as default export
export default sessionReducer;
