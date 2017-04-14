import { errors } from 'iuffy-model'

const localization = require('./locale.zh.json')

errors.localization = Object.keys(localization).reduce((previousLocalization, key) => {
  previousLocalization[key] = localization[key]
  return previousLocalization
}, errors.localization)

errors.register({
  NotAuthorize: 401,
  InvalidEmail: 400,
  InvalidMobile: 400,
  RegionNotSupported: 400,
})

export default errors
