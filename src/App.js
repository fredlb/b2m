import React, { Component } from 'react';
import moment from 'moment';
//import testData from './testData.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { trips: [] };
  }

  componentDidMount() {
    //this.setState({trips: testData});
    const config = {
      method: 'get',
      headers: {
        'Accept': 'application/json'
      }
    };

      fetch('/api/get_trips', config)
      .then( response => {
        response.json().then( data => {
          const trips = data['Trip'].map( trip => {
            return trip['LegList']['Leg'][0];
          });
          this.setState({ trips: trips });
        });
      })
      .catch(err => {
        console.log(err);
    });
}
       
  render() {
    const tripRender = (
      <div className="trips">
        <div className="list">
        { 
          this.state.trips.filter((trip, idx) => {
            if (idx === 0) { return false;}
            return true;
          }).map( (trip, idx) => (
            <div key={idx} className="trip"> {trip['Origin']['time']} - {trip['Destination']['time']}</div>
          ))}
        </div>
      </div>);

    let nextTrip;
    if (this.state.trips.length > 0) {
      const now = moment();
      const nextTripTime = moment(this.state.trips[0]['Origin']['date'] + ' ' + this.state.trips[0]['Origin']['time']);
      const minutesUntilNextTrip = moment.duration(nextTripTime.diff(now));
      nextTrip = (<div className="nextTrip">{minutesUntilNextTrip.minutes()}m {this.state.trips[0]['Origin']['time']} - {this.state.trips[0]['Destination']['time']}</div>);
    }
    return (
      <div className="App">
        <div className="App-header">
          <div className="picker">
            <span className="blacke active">
              B
            </span>
            <span className="medis">
              M
            </span>
          </div>
        </div>
        {nextTrip}
        {tripRender}
      </div>
    );
  }
}

export default App;
