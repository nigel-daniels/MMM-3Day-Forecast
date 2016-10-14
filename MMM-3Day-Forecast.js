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
        this.units = config.units;
        this.loaded = false;
        this.url = 'http://api.wunderground.com/api/' + this.config.api_key + '/forecast/q/' + this.config.state + '/' + this.config.city +'.json';
        this.forecast = [];

        // Trigger the first request
        this.getWeatherData(this);
        },


    getStyles: function() {
        return ['3day_forecast.css', 'font-awesome.css'];
        },


    getTranslations: function() {
        return {
            en: "translations/en.json"
            }
        }

    getWeatherData: function(that) {
        // Make the initial request to the helper then set up the timer to perform the updates
        that.sendSocketNotification('GET-3DAY-FORECAST', that.url);
        setTimeout(that.getWeatherData, that.config.interval, that);
        },


    getDom: function() {
        // Set up the local wrapper
        var wrapper = null;

        // If we have some data to display then build the results
        if (this.loaded) {

            wrapper = document.createElement('table');
		    wrapper.className = 'forecast small';

            forecastRow = document.createElement('tr');

            // Set up the forecast for three three days
            for (var i = 0; i < 3; i++) {
                var forecastClass = '';
                var title = '';

                // Determine which day we are detailing
                switch (i) {
                    case 0:
                        forecastClass = 'today';
                        title = this.translate("TODAY");
                        break;
                    case 1:
                        forecastClass = 'tomorrow';
                        title = this.translate("TOMORROW");
                        break;
                    case 2:
                        forecastClass = 'dayAfter';
                        title = this.translate("DAYAFTER");
                        break;
                    }

                // Create the details for this day
                forcastDay = document.createElement('td');
                forcastDay.className = 'forecastday ' + forecastClass;

                forcastTitle = document.createElement('div');
                forcastTitle.className = 'forecastTitle normal';
                forcastTitle.innerHTML = title;

                forecastIcon = document.createElement('img');
                forecastIcon.className = 'forecastIcon';
                forecastIcon.setAttribute('height', '50');
                forecastIcon.setAttribute('width', '50');
                forecastIcon.src = './modules/MMM-3Day-Forecast/images/' + this.forecast[i].icon + '.gif';

                forecastText = document.createElement('div');
                forecastText.className = 'forecastText';
                forecastText.innerHTML = this.forecast[i].conditions;

                forecastBr = document.createElement('br');


                // Create div to hold all of the detail data
                forecastDetail = document.createElement('div');
                forecastDetail.className = 'forecastDetail';

                // Build up the details regarding temprature
                tempIcon = document.createElement('img');
                tempIcon.className = 'detailIcon';
                tempIcon.setAttribute('height', '15');
                tempIcon.setAttribute('width', '15');
                tempIcon.src = './modules/MMM-3Day-Forecast/images/high.png';

                tempText = document.createElement('span');
                tempText.className = 'normal';
                if (this.units === 'imperial') {
                    tempText.innerHTML = this.forecast[i].highf + '&deg; ' + this.translate("DEGF") + ' (' + this.forecast[i].highc + '&deg; ' + this.translate("DEGC") + ')';
                } else {
                    tempText.innerHTML = this.forecast[i].highc + '&deg; ' + this.translate("DEGC") + ' (' + this.forecast[i].highf + '&deg; ' + this.translate("DEGF") + ')';
                    }

                tempBr = document.createElement('br');

                // Build up the details regarding precipitation %
                rainIcon = document.createElement('img');
                rainIcon.className = 'detailIcon';
                rainIcon.setAttribute('height', '15');
                rainIcon.setAttribute('width', '15');
                rainIcon.src = './modules/MMM-3Day-Forecast/images/wet.png';

                rainText = document.createElement('span');
                rainText.className = 'normal';
                rainText.innerHTML = this.forecast[i].pop + '%';

                rainBr = document.createElement('br');

                // Build up the details regarding humidity %
                humidIcon = document.createElement('img');
                humidIcon.className = 'detailIcon';
                humidIcon.setAttribute('height', '15');
                humidIcon.setAttribute('width', '15');
                humidIcon.src = './modules/MMM-3Day-Forecast/images/humid.png';

                humidText = document.createElement('span');
                humidText.className = 'normal';
                humidText.innerHTML = this.forecast[i].humid + '%';

                humidBr = document.createElement('br');

                // Build up the details regarding wind
                windIcon = document.createElement('img');
                windIcon.className = 'detailIcon';
                windIcon.setAttribute('height', '15');
                windIcon.setAttribute('width', '15');
                windIcon.src = './modules/MMM-3Day-Forecast/images/wind.png';

                windText = document.createElement('span');
                windText.className = 'normal';
                if (this.units === 'imperial') {
                    windText.innerHTML = this.forecast[i].wmaxm + this.translate("MPH") + ' ' + this.forecast[i].wdir;
                } else {
                    windText.innerHTML = this.forecast[i].wmaxk + this.translate("KPH") + ' ' + this.forecast[i].wdir;
                    }

                //windBr = document.createElement('br');

                // Now assemble the details
                forecastDetail.appendChild(tempIcon);
                forecastDetail.appendChild(tempText);
                forecastDetail.appendChild(tempBr);
                forecastDetail.appendChild(rainIcon);
                forecastDetail.appendChild(rainText);
                forecastDetail.appendChild(rainBr);
                forecastDetail.appendChild(humidIcon);
                forecastDetail.appendChild(humidText);
                forecastDetail.appendChild(humidBr);
                forecastDetail.appendChild(windIcon);
                forecastDetail.appendChild(windText);
                //forecastDetail.appendChild(windBr);

                forcastDay.appendChild(forcastTitle);
                forcastDay.appendChild(forecastIcon);
                forcastDay.appendChild(forecastText);
                forcastDay.appendChild(forecastBr);
                forcastDay.appendChild(forecastDetail);

                // Now assemble the final output
                forecastRow.appendChild(forcastDay);
                }

            wrapper.appendChild(forecastRow);
        } else {
            // Otherwise lets just use a simple div
            wrapper = document.createElement('div');
            wrapper.innerHTML = this.translate("LOADING");
            }

        return wrapper;
        },


    socketNotificationReceived: function(notification, payload) {
        // check to see if the response was for us and used the same url
        if (notification === 'GOT-3DAY-FORECAST' && payload.url === this.url) {
                // we got some data so set the flag, stash the data to display then request the dom update
                this.loaded = true;
                this.forecast = payload.forecast;
                this.updateDom(1000);
            }
        }
    });
