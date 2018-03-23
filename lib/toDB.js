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

const toDB = async (mfbLocation) => {
	if (l.isString(mfbLocation)) mfbLocation = {id: mfbLocation, type: 'station'}
    if (!l.isString(mfbLocation.id)) throw new Error('invalid or missing `station` id')
    if (!['region', 'station'].includes(mfbLocation.type)) throw new Error('invalid or missing `station` type')

	const mfbStations = []
	switch (mfbLocation.type) {
		case 'region': {
			const r = (await util.getMfbRegions).find(r => r.id === mfbLocation.id)
			if (!r) throw new Error('given meinfernbus `region` not found')
			const s = (await util.getMfbStations).filter(s => r.stations.includes(s.id))
			mfbStations.push(...s)
			break
		}
		case 'station': {
			const s = (await util.getMfbStations).find(s => s.id === mfbLocation.id)
			if (!s) throw new Error('given meinfernbus `station` not found')
			mfbStations.push(s)
			break
		}
		default: throw new Error('invalid or missing `station` type')
	}

	const locations = []

	for (let m of mfbStations) {
		if (!m.location) throw new Error('location unknown for meinfernbus `station`')
		if (m.location.country.name !== 'Germany') throw new Error('meinfernbus `station` is not in germany')
		if (!util.validPostalCode.test(m.location.zip)) throw new Error('zip code unknown for meinfernbus `station`')
		locations.push({
			longitude: m.location.longitude,
			latitude: m.location.latitude,
			cities: util.getCities(m.location.zip)
		})
	}

	const matchedDbStationStream = db.full().pipe(filter(match(locations)))
	const resultList = await toPromise(matchedDbStationStream)
	return l.sortBy(resultList, r => (-1)*(r.weight || 0))
}

module.exports = toDB
