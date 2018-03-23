# db-meinferbus-cities

Get all DB stations located in the same german city as the given Flixbus/Meinfernbus station or region, and vice versa.

[![npm version](https://img.shields.io/npm/v/db-meinfernbus-cities.svg)](https://www.npmjs.com/package/db-meinfernbus-cities)
[![Build Status](https://travis-ci.org/juliuste/db-meinfernbus-cities.svg?branch=master)](https://travis-ci.org/juliuste/db-meinfernbus-cities)
[![Greenkeeper badge](https://badges.greenkeeper.io/juliuste/db-meinfernbus-cities.svg)](https://greenkeeper.io/)
[![dependency status](https://img.shields.io/david/juliuste/db-meinfernbus-cities.svg)](https://david-dm.org/juliuste/db-meinfernbus-cities)
[![license](https://img.shields.io/github/license/juliuste/db-meinfernbus-cities.svg?style=flat)](LICENSE)
[![chat on gitter](https://badges.gitter.im/juliuste.svg)](https://gitter.im/juliuste)

## Installation

```shell
npm install db-meinfernbus-cities
```

## Usage

Only works for german cities/stations at the moment, other (neighbouring) european countries will hopefully be supported at some point in the future, though.

```javascript
const adapter = require('db-meinfernbus-cities')
```

This package contains data in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format).

- `toDB(meinfernbusRegionOrStation)` to get all DB stations for a given Meinfernbus `station` or `region`
- `toMFB(dbStation)` to get all Meinfernbus `station`s for a given DB `station`
- `toMFBRegions(dbStation)` to get all Meinfernbus `region`s for a given DB `station`

```js
const adapter = require('db-meinfernbus-cities')

adapter.toDB({type: 'region', id: '88'}).then(…) // list of db station objects for meinfernbus region Berlin
adapter.toDB({type: 'station', id: '89'}).then(…) // list of db station objects for meinfernbus station Bremen
adapter.toDB('89').then(…) // will be interpreted as {type: 'station', id: '89'}

adapter.toMFB({type: 'station', id: '8012666'}).then(…) // list of mfb station objects for Potsdam Hbf
adapter.toMFB('8012666').then(…) // will be interpreted as {type: 'station', id: '8012666'}
adapter.toMFBRegions('8002045').then(…) // list of mfb region objects for Frankfurt(-Eschersheim)
```

## Similar Projects

- [meinfernbus](https://github.com/juliuste/meinfernbus/) – JavaScript client for the Flixbus/Meinfernbus API.
- [search-meinfernbus-locations](https://github.com/derhuerst/search-meinfernbus-locations/) - Search for Flixbus/MeinFernbus cities & stations.
- [db-hafas](https://github.com/derhuerst/db-hafas/) - JavaScript client for the DB Hafas API.
- [db-stations](https://github.com/derhuerst/db-stations/) - A list of DB stations.

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/db-meinfernbus-cities/issues).
