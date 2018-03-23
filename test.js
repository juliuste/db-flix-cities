'use strict'

const tape = require('tape')
const validate = require('validate-fptf')
const cities = require('./index')

tape('db-meinfernbus-cities.toDB', async (t) => {
	const stuttgartResults = await cities.toDB({type: 'region', id: '101'}) // Stuttgart
	t.ok(stuttgartResults.length > 5, 'results length')
	stuttgartResults.every(r => validate(r))
	const [stuttgart] = stuttgartResults
	t.ok(stuttgart.id === '8000096' || (stuttgart.additionalIds && stuttgart.additionalIds.some(i => i === '8000096')), 'stuttgart id')
	t.ok(stuttgart.name === 'Stuttgart Hbf', 'stuttgart name')

	const potsdamResults = await cities.toDB('2855') // Potsdam
	t.ok(potsdamResults.length > 2, 'results length')
	potsdamResults.every(r => validate(r))
	const [potsdam] = potsdamResults
	t.ok(potsdam.id === '8012666' || (potsdam.additionalIds && potsdam.additionalIds.some(i => i === '8012666')), 'potsdam id')
	t.ok(potsdam.name === 'Potsdam Hbf', 'potsdam name')

	t.end()
})

tape('db-meinfernbus-cities.toMFB', async (t) => {
	const results = await cities.toMFB('8002841') // Münster-Hiltrup
	t.ok(results.length > 0, 'results length')
	results.every(r => validate(r))
	t.ok(results.some(r => r.type === 'station' && r.id === '231' && r.name === 'Münster'), 'station münster')
	t.end()
})

tape('db-meinfernbus-cities.toMFBRegions', async (t) => {
	const results = await cities.toMFBRegions('8098553') // Hamburg Altona
	t.ok(results.length === 1, 'results length')
	results.every(r => validate(r))
	t.ok(results.some(r => r.type === 'region' && r.id === '118' && r.name === 'Hamburg'), 'region hamburg')
	t.end()
})
