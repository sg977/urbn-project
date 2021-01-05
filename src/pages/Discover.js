import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import MapAutoComplete from '../components/MapAutoAomplete';
import Marker from '../components/Marker';
import Card from '../components/Card';
import Timer from '../components/Timer';

import { Button, Input, Divider} from 'antd';

// google api key
const apiKey = process.env.REACT_APP_API_KEY;
// default is Philly
const PHILLY = { lat: 39.9525, lng:  -75.1652};
// set up initial state for the parent
class Discover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      constraints: [{ name: '', time: 0 }], //get this back correctly
      searchResults: [],
      mapsLoaded: false,
      markers: [],
      map: {},
      mapsApi: {},
      phillyLatLng: {},
      autoCompleteService: {},
      placesService: {},
      geoCoderService: {},
      directionService: {},
    };
  }

  // Update name for constraint
  updateConstraintName = ((event, key) => {
    event.preventDefault();
    const oldConstraints = this.state.constraints;
    const constraints = Object.assign([], oldConstraints);
    constraints[key].name = event.target.value;
    this.setState({ constraints });
    // it's working
    // window.alert('name is updated')
  });

  // Updates distace for constraint
  updateConstraintTime = ((key, value) => {
    const oldConstraints = this.state.constraints;
    const constraints = Object.assign([], oldConstraints);
    constraints[key].time = value;
    this.setState({ constraints });
    // it's wokring
    // window.alert('time is updated')
  });

  // Adds new marker if it does not exist
  addMarker = ((lat, lng, name) => {
    const oldMarkers = this.state.markers;
    const markers = Object.assign([], oldMarkers);

    // If name already exists in marker, just update
    let newMarker = true;
    // not working
    // window.alert('New Location!')
    for (let i = 0; i < markers.length; i++) {
      if (markers[i].name === name) {
        newMarker = false;
        markers[i].lat = lat;
        markers[i].lng = lng;
        window.alert(`Updated "${name}" Marker`);
        break;
      }
    }
    // Name does not exist in marker list. Create new marker
    if (newMarker) {
        // check if it is push to the new array
      markers.push({ lat, lng, name });
      window.alert(`Added new "${name}" Marker`);
    }
// set state for the newMarker
    this.setState({ markers });
  });

  // Runs once when the Google Maps library is ready
  // Initializes all services that we need
  apiHasLoaded = ((map, mapsApi) => {
    this.setState({
      mapsLoaded: true,
      map,
      mapsApi,
      phillyLatLng: new mapsApi.LatLng(PHILLY.lat, PHILLY.lng),
      autoCompleteService: new mapsApi.places.AutocompleteService(),
      placesService: new mapsApi.places.PlacesService(map),
      geoCoderService: new mapsApi.Geocoder(),
      directionService: new mapsApi.DirectionsService(),
    });
  });

  // Find resturants based on constraints
  handleSearch = (() => {
    const { markers, constraints, placesService, directionService, mapsApi } = this.state;
    console.log(this.state)
    if (markers.length === 0) {
      window.alert('CONSTRAINT NOT VALID');
      return;
    }

    const filteredResults = [];
    const marker = markers[0];
    const timeLimit = constraints[0].time;
    const markerLatLng = new mapsApi.LatLng(marker.lat, marker.lng);

    const placesRequest = {
      location: markerLatLng,
      type: ['restaurant', 'cafe'],
      query: 'restaurant',
      rankBy: mapsApi.places.RankBy.DISTANCE,
    };

    // Look for all resturants 
    placesService.textSearch(placesRequest, ((response) => {
      // Only look at the nearest top 5.
      const responseLimit = Math.min(5, response.length);
      for (let i = 0; i < responseLimit; i++) {
        const restaurant = response[i];
        const { rating, name } = restaurant;
        const address = restaurant.formatted_address;
        const priceLevel = restaurant.price_level;
        let photoUrl = '';
        let openNow = false;
        if (restaurant.opening_hours) {
          openNow = restaurant.opening_hours.open_now; // e.g true/false
        }
        // sometime there is no photo
        if (restaurant.photos && restaurant.photos.length > 0) {
          photoUrl = restaurant.photos[0].getUrl();
        }

        // Second,check if each resturant is within travelling distance
        const directionRequest = {
          origin: markerLatLng,
          destination: address, // Address of resturant
          travelMode: 'DRIVING',
        }

        directionService.route(directionRequest, ((result, status) => {
          if (status !== 'OK') { return }
          const travellingRoute = result.routes[0].legs[0]; // { duration: { text: 1mins, value: 600 } }
          const travellingTimeInMinutes = travellingRoute.duration.value / 60;
          if (travellingTimeInMinutes < timeLimit) {
            const distanceText = travellingRoute.distance.text; // km
            const timeText = travellingRoute.duration.text; // mins
            filteredResults.push({
              name,
              rating,
              address,
              openNow,
              priceLevel,
              photoUrl,
              distanceText,
              timeText,
            });
          }
          // Final results, then add then back to result 
          this.setState({ searchResults: filteredResults });
        }));
      }
    }));
  });

  render() {
    const { constraints, mapsLoaded, phillyLatLng, markers, searchResults } = this.state;
    const { autoCompleteService, geoCoderService } = this.state; // Google Maps Services
    return (
      <div className="w-100 d-flex py-4 flex-wrap justify-content-center">
        {/* Constraints section */}
        <section className="col-4">
          {mapsLoaded ?
            <div>
              {constraints.map((constraint, key) => {
                // set the name and time
                const { name, time } = constraint;
                return (
                  <div key={key} className="mb-4"> 
                    <div id='input' style={{ margin: 50 }} >
                    {/* name should be updated */}
                      <Input style={{ width: 200 }} placeholder="Name" onChange={(event) => this.updateConstraintName(event, key)} />
                      {/* Autocomplete call is working, but not input is submitted */}
                      <MapAutoComplete
                        autoCompleteService={autoCompleteService}
                        geoCoderService={geoCoderService}
                        phillyLatLng={phillyLatLng}
                        markerName={name}
                        addMarker={this.addMarker}
                      />
                    <Timer
                      value={time}
                      onChange={(value) => this.updateConstraintTime(key, value)}
                      text="Search Between 0-60mins"
                    />
                    <Divider />
                     {/* Search Button */}
                    <Button className="mt-4 fw-md" type="primary" size="large" onClick={this.handleSearch}>Search!</Button> 
                    </div>
                  </div>
                );
              })}
            </div>
            : null
          }
        </section>

          {/* api works, map disply correctly */}
        <section className="col-12">
          <GoogleMapReact
            style={{height: '500px'}}
            resetBoundsOnResize={true}
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
            bootstrapURLKeys={{
              key: apiKey,
              libraries: ['places', 'directions']
            }}
            defaultZoom={11}
            defaultCenter={{ lat: PHILLY.lat, lng: PHILLY.lng }}
            yesIWantToUseGoogleMapApiInternals={true}
            onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)} // "maps" is the mapApi
          >
            {/* Pin markers on the Map*/}
            {markers.map((marker, key) => {
              const { name, lat, lng } = marker;
              return (
                <Marker key={key} name={name} lat={lat} lng={lng} />
              );
            })}
          </GoogleMapReact>
        </section>

        {/* Results section */}
        {searchResults.length > 0 ?
          <>
            <Divider />
            <section className="col-12">
              <div className="d-flex flex-column justify-content-center">
                <h1 className="mb-4 fw-md">Tadah! Ice-Creams!</h1>
                <div className="d-flex flex-wrap">
                  {searchResults.map((result, key) => (
                    <Card value={result} key={key} />
                  ))}
                </div>
              </div>
            </section>
          </>
        // if nothing, return null
          : null}
      </div>
    )
  }
}

export default Discover;