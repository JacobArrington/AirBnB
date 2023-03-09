import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route ,Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import SpotDetails from "./components/SpotDetailsPage";
import CreateSpotForm from "./components/CreateSpotForm";
import ManageSpots from "./components/ManageSpots";
import EditSpotForm from "./components/EditSpotForm";
import Reviews from "./components/Reviews";
import PostReviewModal from "./components/PostReviewModal";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path ='/' component ={LandingPage} ></Route>
          <Route path={`/spots/new`} ><CreateSpotForm /></Route>
          <Route path ={`/spots/current`} ><ManageSpots /></Route>
          <Route path ={`spots/:id/edit`}><EditSpotForm /></Route>
          {/* <Route path ={`spots/:id/reviews`}></Route> */}
          <Route path={`/spots/:id`} ><SpotDetails /></Route>
          
        
        </Switch>
      )}
    </>
  );
}

export default App;
