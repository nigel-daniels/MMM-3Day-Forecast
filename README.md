# MMM-3Day-Forcast
This a module for the [MagicMirror](https://github.com/MichMich/MagicMirror/tree/develop).  This module shows a detailed 3 day forcast using the Wunderground API.

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/nigel-daniels/MMM-3Day-Forcast`.  A new folder `MMM-3Day-Forcast` will appear, navigate into it.
2. Execute `npm install` to install the node dependencies.

## Config
The entry in `config.js` can include the following options:

|Option|Description|
|---|---|
|`api_key`|**Required** This is the API key you need to use to requst weather data from the Weather Underground site.  Details on how to request an API key can be found [here](https://www.wunderground.com/weather/api/)<br><br>**Type:** `string`<br>**Default Value:** `null`|
|`state`|This defines the US State or Country to get weather information about.  Valid Wunderground codes are detailed [here](https://www.wunderground.com/weather/api/d/docs?d=resources/country-to-iso-matching)<br><br>**Type:** `string`<br>**Default value:** `CA`|
|`city`|This defines the city to get weather information about.<br><br>**Type:** `string`<br>**Default value:** `San_Jose`|
|`interval`|How often the weather is updated.<br><br>**Type:** `integer`<br>**Default value:** `900000 // 15 minutes`|

Here is an example of an entry in `config.js`
```
{
    module:		'MMM-3Day-Forcast',
    position:	'top_left',
    classes:	'dimmed medium',
    config:		{
                key:	  'xxxxxxxxxxxx',
                state:	'UK',
                city:   'Winchester'
                }
},
```

## Dependencies
- [request](https://www.npmjs.com/package/request) (installed via `npm install`)

## Notes
I hope you like this module, I know it duplicates many other weather modules, however I missed my homebrew mirrors weather information so I recreated it for MM2.  Feel free to submit pull requests or post issues and I'll do my best to respond.

## Thanks To...
- [Michael Teeuw](https://github.com/MichMich) for the [MagicMirror2](https://github.com/MichMich/MagicMirror/tree/develop) framework that made this module possible.
- [Sam Lewis](https://github.com/SamLewis0602) whose [MMM-Traffic](https://github.com/SamLewis0602/MMM-Traffic) module I use and whose code I learnt a great deal from.
- [The Weather Company](https://www.wunderground.com) for the helpful guides and information they publish on their API.
