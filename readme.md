# db-meinferbus-cities

Get all DB stations located in the same german city as the given Flix (Flixbus/Flixtrain) station or region, and vice versa.

[![npm version](https://img.shields.io/npm/v/db-flix-cities.svg)](https://www.npmjs.com/package/db-flix-cities)
[![Build Status](https://travis-ci.org/juliuste/db-flix-cities.svg?branch=master)](https://travis-ci.org/juliuste/db-flix-cities)
[![Greenkeeper badge](https://badges.greenkeeper.io/juliuste/db-flix-cities.svg)](https://greenkeeper.io/)
[![dependency status](https://img.shields.io/david/juliuste/db-flix-cities.svg)](https://david-dm.org/juliuste/db-flix-cities)
[![license](https://img.shields.io/github/license/juliuste/db-flix-cities.svg?style=flat)](LICENSE)
[![fptf version](https://fptf.badges.juliustens.eu/badge/juliuste/db-flix-cities)](https://fptf.badges.juliustens.eu/link/juliuste/db-flix-cities)
[![chat on gitter](https://badges.gitter.im/juliuste.svg)](https://gitter.im/juliuste)

## Installation

```shell
npm install db-flix-cities
```

## Usage

Only works for german cities/stations at the moment, other (neighbouring) european countries will hopefully be supported at some point in the future, though.

```javascript
const adapter = require('db-flix-cities')
```

This package contains data in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format).

- `toDB(flixRegionOrStation)` to get all DB stations for a given Flix `station` or `region`
- `toFlix(dbStation)` to get all Flix `station`s for a given DB `station`
- `toFlixRegions(dbStation)` to get all Flix `region`s for a given DB `station`

```js
const adapter = require('db-flix-cities')

adapter.toDB({type: 'region', id: '88'}).then(…) // list of db station objects for flix region Berlin
adapter.toDB({type: 'station', id: '89'}).then(…) // list of db station objects for flix station Bremen
adapter.toDB('89').then(…) // will be interpreted as {type: 'station', id: '89'}

adapter.toFlix({type: 'station', id: '8012666'}).then(…) // list of flix station objects for Potsdam Hbf
adapter.toFlix('8012666').then(…) // will be interpreted as {type: 'station', id: '8012666'}
adapter.toFlixRegions('8002045').then(…) // list of flix region objects for Frankfurt(-Eschersheim)
```

## Similar Projects

- [flix](https://github.com/juliuste/flix/) – JavaScript client for the Flixbus/Meinfernbus API.
- [search-flix-locations](https://github.com/derhuerst/search-flix-locations/) - Search for Flix cities & stations.
- [db-hafas](https://github.com/derhuerst/db-hafas/) - JavaScript client for the DB Hafas API.
- [db-stations](https://github.com/derhuerst/db-stations/) - A list of DB stations.

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/db-flix-cities/issues).
