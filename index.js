'use strict'

const db = require('db-stations')
const mfb = require('meinfernbus')
const lodash = require('lodash')
const s2p = require('stream-to-promise')
const unzip = require('zip-to-city')


const err = (error) => {throw error}

const dbByCity = (city) => {
	return s2p(db()).then((stations) => {
		let res = lodash.filter(stations, {city: city.name})
		if(res && res.length>0) return res
		else{
			if(city.country.code=='DE'){
				let zipmatch = unzip(city.zip)
				if(zipmatch){
					res = lodash.filter(stations, function(o){return unzip(o.zip)==zipmatch})
					if(res && res.length>0) return res
				}
			}
			return null
		}
	}, err)
}

const mfbByCity = (station) => {
	return mfb.locations.cities().then((locations) => {
		let res = lodash.filter(locations, {name: station.city})
		if(res && res.length>0) return res
		else{
			if((station.zip+'').length==4) station.zip='0'+station.zip
			let zipmatch = unzip(station.zip)
			if(zipmatch){
				res = lodash.filter(locations, function(o){return unzip(o.zip)==zipmatch})
				if(res && res.length>0) return res
			}
			return null
		}
	}, err)
}

const search = (location) => {
	if(location.operator==='db'){
		return s2p(db()).then((stations) => {
			let res = lodash.find(stations, {id: +location.id})
			if(res){
				return mfbByCity(res)
			}
			else err(new Error('DB station not found for given ID.'))
		}, err)
	}
	else if(location.operator==='meinfernbus'){
		let mfblocations
		if(location.type==='station'){mfblocations = mfb.locations.stations}
		else if(location.type==='city'){mfblocations = mfb.locations.cities}
		else err(new Error('Invalid Meinfernbus location type.'))
		return mfblocations().then((locations) => {
			let res = lodash.find(locations, {id: location.id})
			if(res){
				if(location.type==='station'){
					return search({type: 'city', operator: location.operator, id: res.city})
				}
				else{
					return dbByCity(res)
				}
			}
			else err(new Error('Meinfernbus location not found for given ID.'))
		}, err)
	}
	else{
		return Promise.reject(new Error('Invalid location operator.'))
	}
}

module.exports = search