import React, { Component } from 'react';
import moment from 'moment';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trips: [],
      origin: 'blacke',
      originId: 740021685,
      destinationId: 740098556,
      loading: true
    };

    this.fetchData = this.fetchData.bind(this);
    this.blacke = this.blacke.bind(this);
    this.medis = this.medis.bind(this);
  }

  fetchData() {
    const url = `/api/get_trips?originId=${this.state.originId}&destinationId=${this.state.destinationId}`
    const config = {
      method: 'get',
      headers: {
        'Accept': 'application/json'
      }
    };

    this.setState({loading: true});

    fetch(url, config)
      .then( response => {
        response.json().then( data => {
          const trips = data['Trip'].map( trip => {
            return trip['LegList']['Leg'][0];
          });
          this.setState({
            trips: trips,
            loading: false,
          });
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.fetchData();
  }

  blacke() {
    this.setState({
      trips: [],
      origin: 'blacke',
      originId: 740021685,
      destinationId: 740098556,
      loading: true
    });
    this.fetchData();
  }

  medis() {
    this.setState({
      trips: [],
      origin: 'medis',
      originId: 740098556,
      destinationId: 740021685,
      loading: true
    });
    this.fetchData();
  }


  render() {
    let isLoading;
    if (this.state.loading) {
      isLoading = (<div>Loading...</div>);
    }
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
          <div id="indicatorContainer">
            <div onClick={this.blacke} className={`blacke indicator ${this.state.origin === 'blacke' ? 'active' : ''}`}>
              B
            </div>
            <div id="direction"></div>
            <div onClick={this.medis} className={`medis indicator ${this.state.origin === 'medis' ? 'active' : ''}`}>
              M
            </div>
          </div>

        </div>
        <div id="departures">
          {isLoading}
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
