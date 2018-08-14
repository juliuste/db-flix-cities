'use strict'

const l = require('lodash')
const post = require('postal-code')
const point = require('@turf/helpers').point
const distance = require('@turf/distance').default
const mfb = require('meinfernbus')

const validPostalCode = /^\d{5}$/

const locationToPoint = (location) => point([location.longitude, location.latitude])

const compareLocations = (location1, location2) =>
	l.intersection(location1.cities, location2.cities).length > 0
&&	distance(locationToPoint(location1), locationToPoint(location2)) < 100

const getCities = (postalCode) => {
	const c = post.get(postalCode)
	if (!c) throw new Error('invalid postal code '+postalCode+', please report this issue')
	if (!c.regions.length) throw new Error('no region data for postal code '+postalCode+', please report this issue')
	if (l.intersection(c.regions, ['Berlin', 'Bremen', 'Hamburg']).length > 0) return c.regions
	else return c.districts.map(d => [c.regions[0],d].join('-'))
}

const getMfbStations = mfb.stations()
const getMfbRegions = mfb.regions()

module.exports = {
    validPostalCode,
    locationToPoint,
    compareLocations,
    getCities,
    getMfbStations,
    getMfbRegions
}
