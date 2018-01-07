# db-meinferbus-cities

Get all DB stations located in the same city as the given Flixbus/Meinfernbus region, and vice versa.

[![npm version](https://img.shields.io/npm/v/db-meinfernbus-cities.svg)](https://www.npmjs.com/package/db-meinfernbus-cities)
[![Build Status](https://travis-ci.org/juliuste/db-meinfernbus-cities.svg?branch=master)](https://travis-ci.org/juliuste/db-meinfernbus-cities)
[![Greenkeeper badge](https://badges.greenkeeper.io/juliuste/db-meinfernbus-cities.svg)](https://greenkeeper.io/)
[![dependency status](https://img.shields.io/david/juliuste/db-meinfernbus-cities.svg)](https://david-dm.org/juliuste/db-meinfernbus-cities)
[![dev dependency status](https://img.shields.io/david/dev/juliuste/db-meinfernbus-cities.svg)](https://david-dm.org/juliuste/db-meinfernbus-cities#info=devDependencies)
[![license](https://img.shields.io/github/license/juliuste/db-meinfernbus-cities.svg?style=flat)](LICENSE)
[![chat on gitter](https://badges.gitter.im/juliuste.svg)](https://gitter.im/juliuste)

## Installation

```shell
npm install db-meinfernbus-cities
```

## Usage
_Requests may take a few seconds._ The adapter only works for german cities/stations at the moment, I am working on expanding it to other (neighbouring) european countries, though.

```js
const adapter = require('db-meinfernbus-cities')

adapter({type: 'city', id: 88, operator: 'meinfernbus'}).then(…) // list of db-station objects in Berlin
adapter({type: 'station', id: 1, operator: 'meinfernbus'}).then(…) // list of db-station objects in Berlin

adapter({id: 8089079, operator: 'db'}).then(…) // list of Meinfernbus city objects for Berlin (should normally contain 0 or 1 element)
```

## Similar Projects

- [meinfernbus](https://github.com/juliuste/meinfernbus/) – "JavaScript client for the Flixbus/Meinfernbus API."
- [search-meinfernbus-locations](https://github.com/derhuerst/search-meinfernbus-locations/) - "Search for Flixbus/MeinFernbus cities & stations."
- [db-hafas](https://github.com/derhuerst/db-hafas/) - "JavaScript client for the DB Hafas API."
- [db-stations](https://github.com/derhuerst/db-stations/) - "A list of DB stations."

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/db-meinfernbus-cities/issues).
