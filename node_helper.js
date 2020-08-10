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
        },


    getWeatherData: function(payload) {

        var _this = this;
        this.url = payload;

        request({url: this.url, method: 'GET'}, function(error, response, body) {
            // Lets convert the body into JSON
            var result = JSON.parse(body);
            var forecast = []; // Clear the array

            // Check to see if we are error free and got an OK response
            if (!error && response.statusCode == 200) {

                for (var i=0; i < 3; i++) {
                    var day = {
                        icon:       result.data[i].weather.icon,
                        conditions: result.data[i].weather.description,
                        high:      	result.data[i].max_temp,
                        pop:        result.data[i].pop,
                        humid:      result.data[i].rh,
                        wspd:      	result.data[i].wind_spd,
                        wdir:       result.data[i].wind_cdir
                        };

                    forecast.push(day);
                    }
            } else {
                // In all other cases it's some other error
                for (var i=0; i<3; i++) {
                    var day = {
                        icon:       'blank',
                        conditions: 'No weather data',
                        high:      	'--',
                        pop:        '--',
                        humid:      '--',
                        wspd:      	'--',
                        wdir:       '--'
                        };
                    forecast.push(day);
                    }
                }

                // We have the response figured out so lets fire off the notifiction
                _this.sendSocketNotification('GOT-3DAY-FORECAST', {'url': response.request.uri.href, 'forecast': forecast});
            });
        },


    socketNotificationReceived: function(notification, payload) {
        // Check this is for us and if it is let's get the weather data
        if (notification === 'GET-3DAY-FORECAST') {
            this.getWeatherData(payload);
            }
        }

    });
