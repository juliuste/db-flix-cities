'use strict'

const db = require('./lib/toDB')
const mfb = require('./lib/toMFB')

module.exports = {
    toDB: db,
    toMFB: mfb.toMFB,
    toMFBRegions: mfb.toMFBRegions
}
