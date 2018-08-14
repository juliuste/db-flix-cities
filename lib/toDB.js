'use strict'

const l = require('lodash')
const db = require('db-stations')
const filter = require('through2-filter').obj
const toPromise = require('stream-to-array')

const util = require('./util')

const match = (locations) => (station) => {
	if (!station.location) return false
	if (!station.address || !util.validPostalCode.test(station.address.zipcode)) return false
	for (let location of locations) {
		let stationCities = []
		try {
			stationCities = util.getCities(station.address.zipcode) || []
		} catch (e) {}
		const stationLocation = {
			longitude: station.location.longitude,
			latitude: station.location.latitude,
			cities: stationCities
		}
		if (util.compareLocations(stationLocation, location)) return true
	}
	return false
}

const toDB = async (flixLocation) => {
	if (l.isString(flixLocation)) flixLocation = {id: flixLocation, type: 'station'}
    if (!l.isString(flixLocation.id)) throw new Error('invalid or missing `station` id')
    if (!['region', 'station'].includes(flixLocation.type)) throw new Error('invalid or missing `station` type')

	const flixStations = []
	switch (flixLocation.type) {
		case 'region': {
			const r = (await util.getFlixRegions).find(r => r.id === flixLocation.id)
			if (!r) throw new Error('given flix `region` not found')
			const s = (await util.getFlixStations).filter(s => r.stations.includes(s.id))
			flixStations.push(...s)
			break
		}
		case 'station': {
			const s = (await util.getFlixStations).find(s => s.id === flixLocation.id)
			if (!s) throw new Error('given flix `station` not found')
			flixStations.push(s)
			break
		}
		default: throw new Error('invalid or missing `station` type')
	}

	const locations = []

	for (let f of flixStations) {
		if (!f.location) throw new Error('location unknown for flix `station`')
		if (f.location.country.name !== 'Germany') throw new Error('flix `station` is not in germany')
		if (!util.validPostalCode.test(f.location.zip)) throw new Error('zip code unknown for flix `station`')
		locations.push({
			longitude: f.location.longitude,
			latitude: f.location.latitude,
			cities: util.getCities(f.location.zip)
		})
	}

	const matchedDbStationStream = db.full().pipe(filter(match(locations)))
	const resultList = await toPromise(matchedDbStationStream)
	return l.sortBy(resultList, r => (-1)*(r.weight || 0))
}

module.exports = toDB
