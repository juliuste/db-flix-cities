'use strict'

const db = require('./lib/toDB')
const flix = require('./lib/toFlix')

module.exports = {
    toDB: db,
    toFlix: flix.toFlix,
    toFlixRegions: flix.toFlixRegions
}
