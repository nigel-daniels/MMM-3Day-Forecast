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

        var that = this;
        this.url = payload;

        request({url: this.url, method: 'GET'}, function(error, response, body) {
            // Lets convert the body into JSON
            var result = JSON.parse(body);

            // Check to see if we are error free and got an OK response
            if (!error && response.statusCode == 200) {
                var forecast = []; // Clear the array

                for (var i=0; i<3; i++) {
                    var day = {
                        icon:       result.forecast.simpleforecast.forecastday[i].icon,
                        conditions: result.forecast.simpleforecast.forecastday[i].conditions,
                        highc:      result.forecast.simpleforecast.forecastday[i].high.celsius,
                        highf:      result.forecast.simpleforecast.forecastday[i].high.fahrenheit,
                        pop:        result.forecast.simpleforecast.forecastday[i].pop,
                        humid:      result.forecast.simpleforecast.forecastday[i].avehumidity,
                        wmaxk:      result.forecast.simpleforecast.forecastday[i].avewind.kph,
                        wmaxm:      result.forecast.simpleforecast.forecastday[i].avewind.mph,
                        wdir:       result.forecast.simpleforecast.forecastday[i].avewind.dir
                        };

                    forecast.push(day);
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
                        humid:      '--',
                        wmaxk:      '--',
                        wmaxm:      '--',
                        wdir:       '--'
                        };
                    forecast.push(day);
                    }
                }

                // We have the response figured out so lets fire off the notifiction
                that.sendSocketNotification('GOT-3DAY-FORECAST', {'url': that.url, 'forecast': forecast});
            });
        },


    socketNotificationReceived: function(notification, payload) {
        // Check this is for us and if it is let's get the weather data
        if (notification === 'GET-3DAY-FORECAST') {
            this.getWeatherData(payload);
            }
        }

    });
