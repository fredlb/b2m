var express = require('express');
var fetch = require('node-fetch');
var app = express();

app.get('/get_trips', (req, res) => {
    const config = {
      method: 'get',
      headers: {
        'Accept': 'application/json'
      }
    };

    fetch('https://api.resrobot.se/v2/trip?key=SECRIT_KEY_HERE&originId=740021685&destId=740098556&products=32&format=json', config)
      .then( response => {
        response.json().then( data => {
          const trips = data['Trip'].map( trip => {
            return trip['LegList']['Leg'][0];
          });
          res.send(JSON.stringify(data));
        });
      })
      .catch(err => {
        res.send(JSON.stringify(err));
    });
});

var server = app.listen(3001, () => {
  console.log('Serve me some trips, man!');
});
