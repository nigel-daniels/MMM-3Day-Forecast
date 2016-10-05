/* Magic Mirror Module: MMM-FAA-Delay
 * Version: 1.0.0
 *
 * By Nigel Daniels https://github.com/nigel-daniels/
 * MIT Licensed.
 */

Module.register('MMM-3Day-Forecast', {

    defaults: {
            api_key:    '',
            state:      'CA', // Supported states can be found here https://www.wunderground.com/weather/api/d/docs?d=resources/country-to-iso-matching
            city:       'San_Jose',
            interval:   900000 // Every 15 mins
        },


    start:  function() {
        Log.log('Starting module: ' + this.name);

        if (this.data.classes === 'MMM-3Day-Forecast') {
            this.data.classes = 'bright medium';
            }

        // Set up the local values, here we construct the request url to use
        this.loaded = false;
        this.nowURL = 'http://api.wunderground.com/api/' + this.config.api_key + '/conditions/q/' + this.config.state + '/' + this.config.city +'.json';
        this.forecastURL = 'http://api.wunderground.com/api/' + this.config.api_key + '/forecast/q/' + this.config.state + '/' + this.config.city +'.json';
        this.nowIcon = '';
        this.nowWeather = '';
        this.nowTempC = '';
        this.nowTempF = '';
        this.forecast = null;

        // Trigger the first request
        this.getWeatherData(this);
        },


    getStyles: function() {
            return ['3day_forecast.css', 'font-awesome.css'];
        },


    getWeatherData: function(that) {
        // Make the initial request to the helper then set up the timer to perform the updates
        that.sendSocketNotification('GET-3DAY-FORECAST', {'nowURL': that.nowURL, 'forecastURL': that.forecastURL});
        setTimeout(that.getWeatherData, that.config.interval, that);
        },


    getDom: function() {
        // Set up the local wrapper
        var wrapper = null;

        // If we have some data to display then build the results table
        if (this.loaded) {
            wrapper = document.createElement('div');
		    wrapper.className = 'weather small';

            // Set up the first div with the now weather data
            nowDiv = document.createElement('div');
            nowDiv.className = 'now';

            // Elements to add to the now div
            nowIcon = document.createElement('img');
            nowIcon.className = 'nowIcon';
            nowIcon.src = './modules/MMM-3Day-Forecast/images/' + this.nowIcon + '.gif';

            nowDetail = document.createElement('div');
            nowDetail.className = 'nowDetail';

            // Elements to add to the nowDetail
            nowTitle = document.createElement('div');
            nowTitle.className = 'nowTitle';
            nowTitle.innerHTML = 'Now';

            nowText = document.createElement('div');
            nowText.className = 'nowText';
            nowText.innerHTML = this.nowWeather;

            nowTemp = document.createElement('div');
            nowTemp.className = 'nowTemp';
            nowTemp.innerHTML = 'Feels like ' + this.nowTempC + '&deg; C (' + this.nowTempF + '&deg; F)';

            // Add elements to the nowDetail div
            nowDetail.appendChild(nowTitle);
            nowDetail.appendChild(nowText);
            nowDetail.appendChild(nowTemp);

            // Add elements to the now div
            nowDiv.appendChild(nowIcon);
            nowDiv.appendChild(nowDetail);

            // Add the rows to the table
            wrapper.appendChild(nowDiv);
        } else {
            // Otherwise lets just use a simple div
            wrapper = document.createElement('div');
            wrapper.innerHTML = 'Loading weather data...';
            }

        return wrapper;
        },


    socketNotificationReceived: function(notification, payload) {
        // check to see if the response was for us and used the same url
        if (notification === 'GOT-3DAY-FORECAST' && payload.url === this.nowURL) {
                console.log('Payload: ' + JSON.stringify(payload));
                // we got some data so set the flag, stash the data to display then request the dom update
                this.loaded = true;
                this.nowIcon = payload.nowIcon;
                this.nowWeather = payload.nowWeather;
                this.nowTempC = payload.nowTempC;
                this.nowTempF = payload.nowTempF;
                this.forecast = payload.forecast;
                this.updateDom(1000);
            }
        }
    });
