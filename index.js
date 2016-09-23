'use strict'

const db = require('db-stations')
const mfb = require('meinfernbus')
const lodash = require('lodash')
const s2p = require('stream-to-promise')
const postalCode = require('postal-code')

const plz = (zip) => {
	const result = postalCode(zip)
	if(result){
		if(['Berlin', 'Bremen', 'Hamburg'].indexOf(result.regions[0])==-1) return result.districts[0]
		else return result.regions[0]
	}
	return result
}


const err = (error) => {throw error}

const dbByCity = (city) => {
	return s2p(db()).then((stations) => {
		let res = lodash.filter(stations, {city: city.name})
		if(res && res.length>0) return res
		else{
			if(city.country.code=='DE'){
				let postal = plz(city.zip)
				if(postal){
					res = lodash.filter(stations, function(o){return plz(o.zip)==postal})
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
			let postal = plz(station.zip)
			if(postal){
				res = lodash.filter(locations, function(o){return plz(o.zip)==postal})
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