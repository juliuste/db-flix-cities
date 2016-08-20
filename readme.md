# db-meinferbus-cities

Get all DB stations located in the same city as the given Meinfernbus location, and vice versa.

[![npm version](https://img.shields.io/npm/v/db-meinfernbus-cities.svg)](https://www.npmjs.com/package/db-meinfernbus-cities)
[![Build Status](https://travis-ci.org/juliuste/db-meinfernbus-cities.svg?branch=master)](https://travis-ci.org/juliuste/db-meinfernbus-cities)
[![dependency status](https://img.shields.io/david/juliuste/db-meinfernbus-cities.svg)](https://david-dm.org/juliuste/db-meinfernbus-cities)
[![dev dependency status](https://img.shields.io/david/dev/juliuste/db-meinfernbus-cities.svg)](https://david-dm.org/juliuste/db-meinfernbus-cities#info=devDependencies)
[![MIT License](https://img.shields.io/badge/license-MIT-black.svg)](https://opensource.org/licenses/MIT)

## Installation

```shell
npm install db-meinfernbus-cities
```

## Usage
_Requests may take a few seconds._ The adapter only works for german cities/stations at the moment, I am working on expanding it on other (neighbouring) european countries, though.

```js
const adapter = require('db-meinfernbus-cities')

adapter({type: 'city', id: 88, operator: 'meinfernbus'}).then(…) // list of db-station objects in berlin
adapter({type: 'station', id: 1, operator: 'meinfernbus'}).then(…) // list of db-station objects in berlin

adapter({id: 8089079, operator: 'db'}).then(…) // Meinfernbus city object for Berlin
```

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/db-meinfernbus-cities/issues).