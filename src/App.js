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
        {this.state.trips.filter((trip, idx) => {
            if (idx === 0) { return false;}
              return true;
          }).map( (trip, idx) => (
            <div key={idx} className="trip"> {trip['Origin']['time'].substring(0, 5)} - {trip['Destination']['time'].substring(0, 5)}</div>
          ))}
      </div>);

    let nextTrip;
    if (this.state.trips.length > 0) {
      const now = moment();
      const nextTripTime = moment(this.state.trips[0]['Origin']['date'] + ' ' + this.state.trips[0]['Origin']['time']);
      const minutesUntilNextTrip = moment.duration(nextTripTime.diff(now));
      nextTrip = (<div className="nextTrip">{minutesUntilNextTrip.minutes()}m {this.state.trips[0]['Origin']['time'].substring(0, 5)} - {this.state.trips[0]['Destination']['time'].substring(0, 5)}</div>);
    }
    return (
      <div className="app">
        <div className="app-header">
      
          <div className="blacke indicator active">
            B
          </div>
          <div id="direction"></div>
          <div className="medis indicator">
            M
          </div>

        </div>
        <div id="departures">
          {nextTrip}
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          {tripRender}
        </div>
      </div>
    );
  }
}

export default App;
