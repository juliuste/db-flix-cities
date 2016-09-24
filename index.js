'use strict'

const db = require('db-stations')
const mfb = require('meinfernbus')
const lodash = require('lodash')
const s2p = require('stream-to-promise')
const postalCode = require('postal-code')

const plz = (zip) => {
	if(!zip) return null
	try{
		const result = postalCode.get(zip)
		if(result){
			if(['Berlin', 'Bremen', 'Hamburg'].indexOf(result.regions[0])==-1) return result.districts[0]
			else return result.regions[0]
		}
		return result
	}
	catch(error){return null}
}


const err = (error) => {throw error}

const dbByStation = (station) => {
	return s2p(db()).then((stations) => {
		if(station.country.code=='DE'){
			let postal = plz(station.zip)
			if(postal){
				let res = lodash.filter(stations, function(o){return plz(o.zip)==postal})
				if(res && res.length>0) return res
			}
		}
		return []
	}, err)
}

const mfbByCity = (station) => {
	return mfb.locations.stations().then((locations) => {
		let postal = plz(station.zip)
		if(postal){
			let res = lodash.filter(locations, function(o){return plz(o.zip)==postal})
			if(res && res.length>0) return mfb.locations.cities().then((cities) => lodash.filter(cities, {id: res[0].city})[0], err)
		}
		return []
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
				if(location.type==='city'){
					return search({type: 'station', operator: location.operator, id: res.stations[0]})
				}
				else{
					return dbByStation(res)
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