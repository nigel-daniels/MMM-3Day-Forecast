/* Magic Mirror Module: MMM-FAA-Delay
 * Version: 1.0.0
 *
 * By Nigel Daniels https://github.com/nigel-daniels/
 * MIT Licensed.
 */

Module.register('MMM-3Day-Forecast', {
    defaults: {
            state:  'CA',       // Supported states can be found here https://www.wunderground.com/weather/api/d/docs?d=resources/country-to-iso-matching
            city:   'San_Jose'
        },

    start:  function() {
        Log.log('Starting module: ' + this.name);

        if (this.data.classes === 'MMM-3Day-Forecast') {
            this.data.classes = 'bright medium';
            }

        // Set up the local values, here we construct the request url to use
        this.loaded = false;
        this.nowURL = 'http://api.wunderground.com/api/' + this.config.api_key + '/conditions/q/' + this.config.state + '/' + this.config.city +'.json';;
        this.type = '';
        this.message = '';
        this.weather = '';

        // Trigger the first request
        this.getAirportData(this);
        },

    getStyles: function() {
            return ['airport.css', 'font-awesome.css'];
        },

    getAirportData: function(that) {
        // Make the initial request to the helper then set up the timer to perform the updates
        that.sendSocketNotification('GET-3DAY-FORECAST', that.url);
        setTimeout(that.getAirportData, that.config.interval, that);
        },

    getDom: function() {
        // Set up the local wrapper
        var wrapper = null;

        // If we have some data to display then build the results table
        if (this.loaded) {
            wrapper = document.createElement("table");
		    wrapper.className = "airport small";

            // Set up the first row with the aiport data
            airportRow = document.createElement("tr");

            airportCode = document.createElement("td");
            airportCode.className = "code bright";
            airportCode.innerHTML = this.config.airport;


            airportInfo = document.createElement("td");
            airportInfo.className = "type bright";
            airportInfo.innerHTML = this.type;

            airportRow.appendChild(airportCode);
            airportRow.appendChild(airportInfo);

            // Set up the next row with detailed information
            messageRow = document.createElement("tr");

            blank1  = document.createElement("td");
            airportMessage = document.createElement("td");
            airportMessage.className = "message dimmed";
            airportMessage.innerHTML = this.message;

            messageRow.appendChild(blank1);
            messageRow.appendChild(airportMessage);
            // Set up the last row with weather data
            weatherRow = document.createElement("tr");

            blank2  = document.createElement("td");
            airportWeather = document.createElement("td");
            airportWeather.className = "weather dimmed";
            airportWeather.innerHTML = this.weather;

            weatherRow.appendChild(blank2);
            weatherRow.appendChild(airportWeather);

            // Add the rows to the table
            wrapper.appendChild(airportRow);
            wrapper.appendChild(messageRow);
            wrapper.appendChild(weatherRow);
        } else {
            // Otherwise lets just use a simple div
            wrapper = document.createElement('div');
            wrapper.innerHTML = 'Loading airport data...';
            }

        return wrapper;
        },

    socketNotificationReceived: function(notification, payload) {
        // check to see if the response was for us and used the same url
        if (notification === 'GOT-3DAY-FORECAST' && payload.url === this.url) {
                // we got some data so set the flag, stash the data to display then request the dom update
                this.loaded = true;
                this.type = payload.type;
                this.message = payload.message;
                this.weather = payload.weather;
                this.updateDom(1000);
            }
        }
    });
