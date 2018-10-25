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

            // Check to see if we are error free and got an OK response
            if (!error && response.statusCode == 200) {
                var forecast = []; // Clear the array

                for (var i=0; i < 3; i++) {
                    var day = {
                        icon:       result.data[i].weather.icon,
                        conditions: result.data[i].weather.description,
						code: 		result.data[i].weather.code,
                        high:      	Math.trunc(result.data[i].max_temp),
						low:		Math.trunc(result.data[i].min_temp),
                        pop:        result.data[i].pop,
                        humid:      result.data[i].rh,
						sunrise:    result.data[i].sunrise_ts,
						sunset:	    result.data[i].sunset_ts, 
                        wspd:      	result.data[i].wind_spd,
                        wdir:       result.data[i].wind_cdir,
                        wdir_deg:   result.data[i].wind_dir
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
                _this.sendSocketNotification('GOT-3DAY-FORECAST', {'url': _this.url, 'forecast': forecast});
            });
        },


    socketNotificationReceived: function(notification, payload) {
        // Check this is for us and if it is let's get the weather data
        if (notification === 'GET-3DAY-FORECAST') {
            this.getWeatherData(payload);
            }
        }

    });
