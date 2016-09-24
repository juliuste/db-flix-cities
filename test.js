'use strict'

const cities = require('./index')

const works = (text) => {console.log('works')}
const fails = (err) => {
	console.error(err.stack || err.message)
	process.exit(1)
}

cities({type: 'station', id: 1, operator: 'meinfernbus'}).then(works, fails)
cities({type: 'city', id: 88, operator: 'meinfernbus'}).then(works, fails)
cities({type: 'city', id: 96, operator: 'meinfernbus'}).then(works, fails)
cities({id: 8089079, operator: 'db'}).then(works, fails)
cities({id: 8010205, operator: 'db'}).then(works, fails)