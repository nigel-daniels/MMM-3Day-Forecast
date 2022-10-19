/* Magic Mirror Module: MMM-3Day-Forecast helper
 * Version: 1.0.0
 *
 * By Nigel Daniels https://github.com/nigel-daniels/
 * MIT Licensed.
 */

var NodeHelper = require('node_helper');
var Log = require('logger');
var date = require('date-fns');
var dateTZ = require('date-fns-tz');
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
            var now = new Date();

            // Check to see if we are error free and got an OK response
            if (!error && response.statusCode == 200) {
                var tomorrow = {};
                var dayafter = {};

                // Let's add todays weather based on the next few hours
                var today = {
                    icon:       result.list[0].weather[0].icon,
                    conditions: result.list[0].weather[0].description,
                    high:      	result.list[0].main.temp_max,
                    pop:        result.list[0].pop,
                    humid:      result.list[0].main.humidity,
                    wspd:      	result.list[0].wind.speed,
                    wdir:       _this.degToDir(result.list[0].wind.deg)
                    };

                // Now let's go through the list 
                result.list.forEach((element, i) => {
                    // Localize the timestamp for our zone
                    var dateTime = dateTZ.utcToZonedTime(date.fromUnixTime(element.dt));

                    // This will build tomorrows forecast
                    if ( date.isTomorrow(dateTime) ) {
                        _this.populateDay(tomorrow, element, dateTime);
                    }
                    
                    // This will the day afters forecast
                    if (date.differenceInDays(dateTime, now) === 2) {
                        _this.populateDay(dayafter, element, dateTime);
                    }

                    forecast.push(today);
                    forecast.push(tomorrow);
                    forecast.push(dayafter);
                });

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
        },
    
    populateDay: function(day, element, dateTime) {
        day.high = this.getHighValue(day.high, element.main.temp_max);
        day.pop = this.getHighValue(day.pop, element.pop);
        day.humid = this.getHighValue(day.humid, element.main.humidity);

        day.wspd = this.getHighValue(day.wspd, element.wind.speed);

        if (day.wspd <= element.wind.speed) {
            day.wspd = element.wind.speed;
            day.wdir = this.degToDir(element.wind.deg);
        }

        if (date.getHours(dateTime) === 12) {
            day.icon = element.weather[0].icon;
            day.conditions = element.weather[0].description;
        }
    
        return day;
    },

    getHighValue: function(old, test) {
        var result = undefined;

        if (old === undefined) {
            result = test;
        } else {
            result = old < test ? test : old;
        }

        return result;
    },

    degToDir: function(deg) {
        switch(deg) {
            case deg < 11.25:
                return 'N';
                break;
            case deg < 33.75:
                return 'NNE';
                break;
            case deg < 56.75:
                return 'NE';
                break;    
            case deg < 78.75:
                return 'ENE';
                break;
            case deg < 101.25:
                return 'E';
                break;
            case deg < 123.75:
                return 'ESE';
                break; 
            case deg < 146.25:
                return 'SE';
                break;
            case deg < 168.75:
                return 'SSE';
                break;
            case deg < 191.25:
                return 'S';
                break;    
            case deg < 213.75:
                return 'SSW';
                break;
            case deg < 236.25:
                return 'SW';
                break;
            case deg < 258.75:
                return 'WSW';
                break;
            case deg < 281.25:
                return 'W';
                break;
            case deg < 303.75:
                return 'WNW';
                break;
            case deg < 326.25:
                return 'NW';
                break;    
            case deg < 348.75:
                return 'NNW';
                break;
            default:
                return 'N';
                break;
        }
    }
    });
