const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'mapquest',
    httpAdapter: 'https',
    apiKey: 'sj4bekI9IcSLoUN8TvWJ5cAC8vPxPri7',
    formatter: null
}

const geocoder = NodeGeocoder(options);

module.exports = geocoder;