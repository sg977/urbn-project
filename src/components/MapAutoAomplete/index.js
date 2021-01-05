import React, { Component } from 'react';
import { AutoComplete } from 'antd';

class MapAutoComplete extends Component {
  constructor(props) {
      // using super to have full access to parent constructor
    super(props);
    this.state = {
      suggestions: [],
      options: [{}],
      phillyLatLng: this.props.phillyLatLng,
      // from google api
      autoCompleteService: this.props.autoCompleteService,
      geoCoderService: this.props.geoCoderService,
    }
    console.log("this is OG state", this.state.suggestionts);
  }

  onSelect = ((value) => {
    this.state.geoCoderService.geocode({ address: value }, ((response) => {
      //example response 
      // "geometry" : {
      //   "location" : {
      //      "lat" : 37.4267861,
      //      "lng" : -122.0806032
      //   }
      const { location } = response[0].geometry;
      // locate the marker
      this.props.addMarker(location.lat(), location.lng(), this.props.markerName);
    }))
  });


  // Runs a search on the current value 
  handleSearch = ((value) => {
    const { autoCompleteService, phillyLatLng } = this.state;
    // Search when input is not empty
    if (value.length > 0) {
      const searchQuery = {
        input: value,
        location: phillyLatLng,
        radius: 30000, // With a 30km radius
      };
      autoCompleteService.getQueryPredictions(searchQuery, ((response) => {
        // The name of each GoogleMaps suggestion object is in the "description" field
        if (response) { 
          // description is the address in response
          const options = response.map((resp) => resp.description);
          console.log(options);
          this.setState(options);
          this.setState({ suggestions:response })
          console.log("this is autocomplete", this.state)
        }
      }));
    }
  });

  render() {
    const { options } = this.state; //set state again before rendering
    // this is an emtpy array
    console.log("this is render", options)
    return (
      <AutoComplete
        style={{ width: 200 }}
        options={options}
        onSelect={this.onSelect}
        onSearch={this.handleSearch}
        placeholder="Address"
        autoComplete="on"
      />
    );
  }
}

export default MapAutoComplete;
