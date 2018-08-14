'use strict'

const l = require('lodash')
const db = require('db-stations')
const filter = require('through2-filter').obj
const toPromise = require('stream-to-array')
const matchState = require('match-german-federal-states')

const util = require('./util')

const isGermanUICID = (id) => {
	if (id.length === 7 && id.slice(0, 2) === '80') return true
	if (id.length === 9 && id.slice(0, 2) === '0080') return true
	return false
}

// todo: improve this, maybe geojson comparison
const inGermany = (station) => {
	if (isGermanUICID(station.id)) return true
	if (Array.isArray(station.additionalIds) && station.additionalIds.some(isGermanUICID)) return false
	if (s.federalState || matchState(s.federalState)) return true
	return false
}

const getDbStation = (id) =>
	toPromise(db().pipe(filter(s => s.id === id || (s.additionalIds && s.additionalIds.includes(id)))))
	.then(res => res.length ? res[0] : null)

const match = (location) => (station) => {
	if (!station.location) return false
	if (!util.validPostalCode.test(station.location.zip)) return false
	let stationCities = []
	try {
		stationCities = util.getCities(station.location.zip) || []
	} catch (e) {}
	const stationLocation = {
		longitude: station.location.longitude,
		latitude: station.location.latitude,
		cities: stationCities
	}
	if (util.compareLocations(stationLocation, location)) return true
	return false
}

const getRegionForStation = async (flixStation) => {
	const flixRegions = await util.getFlixRegions
	return flixRegions.filter(r => flixStation.regions.includes(r.id))
}

const toFlix = async (dbStation) => {
	if (l.isString(dbStation)) dbStation = {id: dbStation, type: 'station'}
    if (!l.isString(dbStation.id)) throw new Error('invalid or missing `station` id')
    if (dbStation.type !== 'station') throw new Error('invalid or missing `station` type')

	const s = await getDbStation(dbStation.id)
	if (!s) throw new Error('given db `station` not found')

	if (!s.location) throw new Error('location unknown for db `station`')
	if (!inGermany(s)) throw new Error('db `station` is not in germany')
	if (!s.address || !util.validPostalCode.test(s.address.zipcode)) throw new Error('zip code unknown for db `station`')

	const location = {
		longitude: s.location.longitude,
		latitude: s.location.latitude,
		cities: util.getCities(s.address.zipcode)
	}

	const flixStations = await util.getFlixStations
	return flixStations.filter(match(location))
}

const toFlixRegions = async (dbStation) => {
	const flixStations = await toFlix(dbStation)
	const flixRegions = await Promise.all(flixStations.map(getRegionForStation))
	return l.unionBy(...flixRegions, r => r.id)
}

module.exports = {toFlix, toFlixRegions}
