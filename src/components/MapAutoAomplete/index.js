import React, { Component } from 'react';
import { AutoComplete } from 'antd';

class MapAutoComplete extends Component {
  constructor(props) {
      // using super to have full access to parent constructor
    super(props);
    this.state = {
      suggestionts: [],
      options: [],
      phillyLatLng: this.props.phillyLatLng,
      // from google api
      autoCompleteService: this.props.autoCompleteService,
      geoCoderService: this.props.geoCoderService,
    }
  }

  onSelect = ((value) => {
    this.state.geoCoderService.geocode({ address: value }, ((response) => {
      const { location } = response[0].geometry;
      this.props.addMarker(location.lat(), location.lng(), this.props.markerName);
    }))
  });


  // Runs a search on the current value 
  handleSearch = ((value) => {
    const { autoCompleteService, phillyLatLng } = this.state;
    // Search only if there is a string
    if (value.length > 0) {
      const searchQuery = {
        input: value,
        location: phillyLatLng,
        radius: 30000, // With a 30km radius
      };
      autoCompleteService.getQueryPredictions(searchQuery, ((response) => {
        // The name of each GoogleMaps suggestion object is in the "description" field
        if (response) {
          const options = response.map((resp) => resp.description);
          this.setState({ options, suggestions: response });
        }
      }));
    }
  });

  render() {
    const { dataSource } = this.state;
    return (
      <AutoComplete
        className="w-200"
        options={dataSource}
        onSelect={this.onSelect}
        onSearch={this.handleSearch}
        placeholder="Address"
      />
    );
  }
}

export default MapAutoComplete;
