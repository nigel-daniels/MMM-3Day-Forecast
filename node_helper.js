/* Magic Mirror Module: MMM-3Day-Forecast helper
 * Version: 1.0.0
 *
 * By Nigel Daniels https://github.com/nigel-daniels/
 * MIT Licensed.
 */

var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({

    start: function () {
        console.log('MMM-3Day-Forecast helper, started...');

        // Set up the local values
        this.nowIcon = '';
        this.nowWeather = '';
        this.nowTempC = '';
        this.nowTempF = '';
        this.forecast = [];
        },


    getWeatherData: function(nowURL, forecastURL) {

        var that = this;

        request({url: nowURL, method: 'GET'}, function(error, response, body) {
            // Lets convert the body into JSON
            var result = JSON.parse(body);

            // Check to see if we are error free and got an OK response
            if (!error && response.statusCode == 200) {
                // Let's get the weather data for right now
                that.nowIcon = result.current_observation.icon;
                that.nowWeather = result.current_observation.weather;
                that.nowTempC = result.current_observation.feelslike_c;
                that.nowTempF = result.current_observation.feelslike_f;
            } else {
                // In all other cases it's some other error
                that.nowIcon = 'blank';
                that.nowWeather = 'Error getting data';
                that.nowTempC = '--';
                that.nowTempF = '--';
                }
            console.log('NOW THAT icon:' + that.nowIcon + ', weather: ' + that.nowWeather);
            });

        request({url: forecastURL, method: 'GET'}, function(error, response, body) {
            // Lets convert the body into JSON
            var result = JSON.parse(body);

            // Check to see if we are error free and got an OK response
            if (!error && response.statusCode == 200) {
                for (var i=0; i<3; i++) {
                    var day = {
                        icon:       result.forecast.simpleforecast.forecastday[i].icon,
                        conditions: result.forecast.simpleforecast.forecastday[i].conditions,
                        highc:      result.forecast.simpleforecast.forecastday[i].high.celsius,
                        highf:      result.forecast.simpleforecast.forecastday[i].high.fahrenheit,
                        pop:        result.forecast.simpleforecast.forecastday[i].pop,
                        wmaxk:      result.forecast.simpleforecast.forecastday[i].avewind.mph,
                        wmaxm:      result.forecast.simpleforecast.forecastday[i].avewind.mph,
                        wdir:       result.forecast.simpleforecast.forecastday[i].avewind.dir
                        };
                    that.forecast.pop(day);
                    }
            } else {
                // In all other cases it's some other error
                for (var i=0; i<3; i++) {
                    var day = {
                        icon:       'blank',
                        conditions: 'No weather data',
                        highc:      '--',
                        highf:      '--',
                        pop:        '--',
                        wmaxk:      '--',
                        wmaxm:      '--',
                        wdir:       '--'
                        };
                    that.forecast.pop(day);
                    }
                }
            });

        console.log('NOW THIS icon:' + this.nowIcon + ', weather: ' + this.nowWeather);

        // We have the response figured out so lets fire off the notifiction
        this.sendSocketNotification('GOT-3DAY-FORECAST', {'url': nowURL, 'nowIcon': this.nowIcon, 'nowWeather': this.nowWeather, 'nowTempC': this.nowTempC, 'nowTempF': this.nowTempF, 'forecast': this.forecast});
        },


    socketNotificationReceived: function(notification, payload) {
        // Check this is for us and if it is let's get the weather data
        if (notification === 'GET-3DAY-FORECAST') {
            this.getWeatherData(payload.nowURL, payload.forecastURL);
            }
        }

    });
