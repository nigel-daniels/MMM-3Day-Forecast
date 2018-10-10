/* Magic Mirror Module: MMM-FAA-Delay
 * Version: 1.0.0
 *
 * By Nigel Daniels https://github.com/nigel-daniels/
 * MIT Licensed.
 */

Module.register('MMM-3Day-Forecast', {

	defaults: {
		api_key: '',
		lat: 0.0,
		lon: 0.0,
		units: 'M',
		lang: 'en',
		showSunrise: true,
		showHumidity: true,
		showRain: true,
		showWind: true,
		horizontalView: false,
		interval: 900000 // Every 15 mins
		codeIconTable: {
			  "201": "wi-thunderstorm",
			  "202": "wi-thunderstorm",
			  "230": "wi-storm-showers",
			  "231": "wi-storm-showers",
			  "232": "wi-storm-showers",
			  "233": "wi-thunderstorm",
			  "300": "wi-sprinkle",
			  "301": "wi-sprinkle",
			  "302": "wi-sprinkle",
			  "500": "wi-showers",
			  "501": "wi-showers",
			  "502": "wi-showers",
			  "511": "wi-showers",
			  "520": "wi-rain",
			  "521": "wi-rain",
			  "522": "wi-rain",
			  "600": "wi-snow",
			  "601": "wi-snow",
			  "602": "wi-snow",
			  "610": "wi-rain-mix",
			  "611": "wi-sleet",
			  "612": "wi-sleet",
			  "621": "wi-snow",
			  "622": "wi-snow",
			  "623": "wi-rain",
			  "700": "wi-fog",
			  "711": "wi-smoke",
			  "721": "wi-smog",
			  "731": "wi-dust",
			  "741": "wi-fog",
			  "751": "wi-fog",
			  "800": "wi-day-sunny",
			  "801": "wi-day-cloudy",
			  "802": "wi-day-cloudy",
			  "803": "wi-day-cloudy",
			  "804": "wi-cloudy",
			  "900": "wi-na"
		},
	},


	start: function () {
		Log.log('Starting module: ' + this.name);

		// Set up the local values, here we construct the request url to use
		this.units = this.config.units;
		this.loaded = false;
		this.url = 'https://api.weatherbit.io/v2.0/forecast/daily?key=' + this.config.api_key + '&lat=' + this.config.lat + '&lon=' + this.config.lon + '&units=' + this.config.units + '&lang=' + this.config.lang + '&days=3';
		this.forecast = [];
		this.horizontalView = this.config.horizontalView;

		// Trigger the first request
		this.getWeatherData(this);
	},


	getStyles: function () {
		return ['weather-icons-wind.css','weather-icons.css', '3day_forecast.css', 'font-awesome.css'];
	},


	getTranslations: function () {
		return {
			da: 'translations/da.json',
			en: 'translations/en.json',
			he: 'translations/he.json',
			nb: 'translations/nb.json'
		};
	},

	getWeatherData: function (_this) {
		// Make the initial request to the helper then set up the timer to perform the updates
		_this.sendSocketNotification('GET-3DAY-FORECAST', _this.url);
		setTimeout(_this.getWeatherData, _this.config.interval, _this);
	},


	getDom: function () {
		// Set up the local wrapper
		var wrapper = null;


		// If we have some data to display then build the results
		if (this.loaded) {

			wrapper = document.createElement('table');
			if (this.horizontalView) {

				wrapper.className = 'small';

				// Set up the forecast for three three days
				for (var i = 0; i < 3; i++) {
					var title = '';
					var C = '--';
					var F = '--';

					// Determine which day we are detailing
					switch (i) {
						case 0:
							title = this.translate('TODAY');
							break;
						case 1:
							title = this.translate('TOMORROW');
							break;
						case 2:
							title = this.translate('DAYAFTER');
							break;
					}

					if (this.forecast[i].high !== '--') {
						if (this.units === 'M') {
							C = this.forecast[i].high;
						} else {
							F = this.forecast[i].high;
						}
					}
					if (this.forecast[i].low !== '--') {
						if (this.units === 'M') {
							C = this.forecast[i].low + '&deg' + " - " + C;
						} else {
							F = this.forecast[i].low + '&deg' + " - " + F;
						}
					}

					row1 = document.createElement('tr');

					forecastIconCell = document.createElement('td');
					forecastIconCell.className = 'forecastIcon2';
					forecastIconCell.setAttribute('rowspan', '2');

					forecastIcon = document.createElement('img');
					forecastIcon.setAttribute('height', '50');
					forecastIcon.setAttribute('width', '50');
					forecastIcon.src = './modules/MMM-3Day-Forecast/images/' + this.forecast[i].icon + '.gif';

					forecastTitleCell = document.createElement('td');
					forecastTitleCell.className = 'forecastTitle2 bright';
					forecastTitleCell.setAttribute('colspan', '4');
					forecastTitleCell.innerHTML = title;

					row2 = document.createElement('tr');

					tempIconCell = document.createElement('td');
					tempIconCell.className = 'detailIcon2';

					tempIcon = document.createElement('i');
					tempIcon.className = 'wi wi-thermometer';

					tempCell = document.createElement('td');
					tempCell.className = 'detailText2';
					if (this.units === 'M') {
						tempCell.innerHTML = C + '&deg'
					} else {
						tempCell.innerHTML = F + '&deg'
					}
					rainIconCell = document.createElement('td');
					rainIconCell.className = 'detailIcon2';

					rainIcon = document.createElement('i');
					rainIcon.className = 'wi wi-raindrops';


					rainCell = document.createElement('td');
					rainCell.className = 'detailText2';
					rainCell.innerHTML = this.forecast[i].pop + '%';

					row3 = document.createElement('tr');

					forecastTextCell = document.createElement('td');
					forecastTextCell.className = 'forecastText2';
					forecastTextCell.innerHTML = this.translate(this.forecast[i].conditions);

					humidityIconCell = document.createElement('td');
					humidityIconCell.className = 'detailIcon2';

					humidityIcon = document.createElement('i');
					humidityIcon.className = 'wi wi-humidity';

					humidityCell = document.createElement('td');
					humidityCell.className = 'detailText2';
					humidityCell.innerHTML = this.forecast[i].humid + '%';

					windIconCell = document.createElement('td');
					windIconCell.className = 'detailIcon2';

					windIcon = document.createElement('i');
					windIcon.className = 'wi wi-wind towards-' + this.forecast[i].wdir_deg + '-deg';

					//windIcon.src = './modules/MMM-3Day-Forecast/images/' + this.forecast[i].wdir + '.png';

					windCell = document.createElement('td');
					windCell.className = 'detailText2';

					if (this.units === 'M') {
						windCell.innerHTML = (Math.round(this.forecast[i].wspd * 10) / 10) + ' ' + this.translate('MPS');
					} else {
						windCell.innerHTML = (Math.round(this.forecast[i].wspd * 10) / 10) + ' ' + this.translate('MPH');
					}

					forecastIconCell.appendChild(forecastIcon);

					tempIconCell.appendChild(tempIcon);
					rainIconCell.appendChild(rainIcon);
					humidityIconCell.appendChild(humidityIcon);
					windIconCell.appendChild(windIcon);

					row1.appendChild(forecastIconCell);
					row1.appendChild(forecastTitleCell);

					row2.appendChild(tempIconCell);
					row2.appendChild(tempCell);
					row2.appendChild(rainIconCell);
					row2.appendChild(rainCell);

					row3.appendChild(forecastTextCell);
					row3.appendChild(humidityIconCell);
					row3.appendChild(humidityCell);
					row3.appendChild(windIconCell);
					row3.appendChild(windCell);

					wrapper.appendChild(row1);
					wrapper.appendChild(row2);
					wrapper.appendChild(row3);
				}

			} else {

				wrapper.className = 'forecast small';

				forecastRow = document.createElement('tr');

				// Set up the forecast for three three days
				for (var i = 0; i < 3; i++) {
					var forecastClass = '';
					var title = '';
					var C = '--';
					var F = '--';

					// Determine which day we are detailing
					switch (i) {
						case 0:
							forecastClass = 'today';
							title = this.translate('TODAY');
							break;
						case 1:
							forecastClass = 'tomorrow';
							title = this.translate('TOMORROW');
							break;
						case 2:
							forecastClass = 'dayAfter';
							title = this.translate('DAYAFTER');
							break;
					}

					if (this.forecast[i].high !== '--') {
						if (this.units === 'M') {
							C = this.forecast[i].high;
							//F = Math.round( (((C*9)/5)+32) * 10 ) / 10;
						} else {
							F = this.forecast[i].high;
							//C = Math.round( (((F-32)*5)/9) * 10 ) / 10;
						}
					}
					if (this.forecast[i].low !== '--') {
						if (this.units === 'M') {
							C = this.forecast[i].low + '&deg' + " - " + C;
						} else {
							F = this.forecast[i].low + '&deg' + " - " + F;
						}
					}


					// Create the details for this day
					forcastDay = document.createElement('td');
					forcastDay.className = 'forecastday ' + forecastClass;

					forcastTitle = document.createElement('div');
					forcastTitle.className = 'forecastTitle';
					forcastTitle.innerHTML = title;

					forecastIcon = document.createElement('i');
					forecastIcon.className = 'wi ' + this.config.codeIconTable[this.forecast[i].code];
					
					forecastText = document.createElement('div');
					forecastText.className = 'forecastText horizontalView bright';

					forecastText.innerHTML = this.translate(this.forecast[i].conditions);

					forecastBr = document.createElement('br');


					// Create div to hold all of the detail data
					forecastDetail = document.createElement('div');
					forecastDetail.className = 'forecastDetail';

					// Build up the details regarding temprature
					tempIcon = document.createElement('i');
					tempIcon.className = 'wi wi-thermometer';


					tempText = document.createElement('span');
					tempText.className = 'normal';
					if (this.units === 'M') {
						tempText.innerHTML = C + '&deg'
					} else {
						tempText.innerHTML = F + '&deg'
					}

					tempBr = document.createElement('br');

					// Build up the details regarding precipitation %
					rainIcon = document.createElement('i');
					rainIcon.className = 'wi wi-raindrops';


					rainText = document.createElement('span');
					rainText.innerHTML = this.forecast[i].pop + '%';

					rainBr = document.createElement('br');

					// Build up the details regarding humidity %
					humidIcon = document.createElement('i');
					humidIcon.className = 'wi wi-humidity';

					humidText = document.createElement('span');
					humidText.className = 'normal';
					humidText.innerHTML = this.forecast[i].humid + '%';

					humidBr = document.createElement('br');
					// Build up the details regarding sunrise
					sunriseIcon = document.createElement('i');
					sunriseIcon.className = 'wi wi-sunrise';

					sunriseText = document.createElement('span');
					var sunrise = new Date((this.forecast[i].sunrise) * 1000);
					var sunset = new Date((this.forecast[i].sunset) * 1000);
					sunriseText.innerHTML = sunrise.getHours() + ":" + sunrise.getMinutes() + " / " + sunset.getHours() + ":" + sunset.getMinutes();
					sunriseBr = document.createElement('br');

					// Build up the details regarding sunset
					sunsetIcon = document.createElement('i');
					sunsetIcon.className = 'wi wi-sunset';

					//	sunsetIcon.src = './modules/MMM-3Day-Forecast/images/wet.png';
					sunsetText = document.createElement('span');
					var d = new Date((this.forecast[i].sunset) * 1000);
					sunsetText.innerHTML = d.getHours() + ":" + d.getMinutes();
					sunsetBr = document.createElement('br');


					// Build up the details regarding wind
					windIcon = document.createElement('i');
					windIcon.className = 'wi wi-wind towards-' + this.forecast[i].wdir_deg + '-deg';

					windText = document.createElement('span');
					if (this.units === 'M') {
						windText.innerHTML = (Math.round(this.forecast[i].wspd * 10) / 10) + ' ' + this.translate('MPS') + ' ' + this.forecast[i].wdir;
					} else {
						windText.innerHTML = (Math.round(this.forecast[i].wspd * 10) / 10) + ' ' + this.translate('MPH') + ' ' + this.forecast[i].wdir;
					}

					//windBr = document.createElement('br');

					// Now assemble the details
					forecastDetail.appendChild(tempIcon);
					forecastDetail.appendChild(tempText);
					forecastDetail.appendChild(tempBr);
					if (this.config.showRain) {
						forecastDetail.appendChild(rainIcon);
						forecastDetail.appendChild(rainText);
						forecastDetail.appendChild(rainBr);
					}
					if (this.config.showHumidity) {

						forecastDetail.appendChild(humidIcon);
						forecastDetail.appendChild(humidText);
						forecastDetail.appendChild(humidBr);
					}
					if (this.config.showSunrise) {
						forecastDetail.appendChild(sunriseIcon);
						forecastDetail.appendChild(sunriseText);
						forecastDetail.appendChild(sunriseBr);
					}
				
					if (this.config.showWind) {
						forecastDetail.appendChild(windIcon);
						forecastDetail.appendChild(windText);
						//forecastDetail.appendChild(windBr);\
					}

					forcastDay.appendChild(forcastTitle);
					forcastDay.appendChild(forecastIcon);
					forcastDay.appendChild(forecastText);
					forcastDay.appendChild(forecastBr);
					forcastDay.appendChild(forecastDetail);

					// Now assemble the final output
					forecastRow.appendChild(forcastDay);
				}

				wrapper.appendChild(forecastRow);
			}
		} else {
			// Otherwise lets just use a simple div
			wrapper = document.createElement('div');
			wrapper.innerHTML = this.translate('LOADING');
		}

		return wrapper;
	},


	socketNotificationReceived: function (notification, payload) {
		// check to see if the response was for us and used the same url
		if (notification === 'GOT-3DAY-FORECAST' && payload.url === this.url) {
			// we got some data so set the flag, stash the data to display then request the dom update
			this.loaded = true;
			this.forecast = payload.forecast;
			this.updateDom(1000);
		}
	}
});
