import { errors } from 'iuffy-model'
import jwt from 'jsonwebtoken'
import * as exemptions from './exemptions'

function authorize(req) {
  if (!exemptions.has(req.url)) {
    const { id, token } = req.user
    if (!id || !token) {
      return new errors.UnauthorizedError()
    }
  }
}

export default (config) => {
  return (req, res, next) => {
    const token = req.headers['x-auth-key']
    if (token) {
      const credentials = jwt.verify(token, config.secret.jwt)
      req.user = {
        id: credentials.userId,
        token,
      }
    }
    next(authorize(req))
  }
}

export const generateToken = (userId) => {
  const { config } = global
  return jwt.sign({ userId }, config.secret.jwt, config.jwtOptions)
}
