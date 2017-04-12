import log4js from 'log4js'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import models, { configure } from 'iuffy-model'
import config from './config'
import authorization from './authorization'
import * as route from './route'
import errors from './errors'

global.models = models
global.config = config

const instance = process.env.NODE_APP_INSTANCE

const log = log4js.getLogger()

async function server() {
  const { __TEST__ } = global
  if (!__DEV__) {
    log.setLevel('INFO')
  }

  let port = config.server.port
  if (instance) port += instance

  // 创建，或更新数据库版本
  try {
    const manager = await configure(config)
    await manager.update()
    log.info(`database version: ${manager.version}`)
  } catch (err) {
    return log.error(err)
  }

  const express = require('express')

  const app = express()
  app.use(helmet())

  const apiRouter = new express.Router()

  if (__DEV__ && !__TEST__) {
    apiRouter.use(
      log4js.connectLogger(
        log,
        { level: 'auto', format: ':method :url :status :response-timems' },
      ),
    )

    // 开发模式下，模拟网络延迟
    app.use((req, res, next) => {
      setTimeout(next, 1000)
    })
  }

  apiRouter.use(cookieParser(config.secret.cookie))
  apiRouter.use(bodyParser.json())
  apiRouter.use(authorization(config))

  route.bind(apiRouter)

  // error handling
  apiRouter.use((err, req, res, next) => {
    const error = {}
    let statusCode = 500
    if (typeof err === 'string') {
      const e = new errors.InternalError()
      error.code = e.name
      error.message = `${errors.lang(e)} (${err})` || e.name
    } else {
      error.code = err.code
      error.message = err.message
      statusCode = err.statusCode || statusCode
    }

    res.status(statusCode).send({ error })
  })

  app.use('/api/v0/', apiRouter)

  if (__TEST__) return app

  return app.listen(port, () => {
    /* eslint-disable no-undef */
    log.info(`The server [${config.name}] running on port: ${port}`)
  })
}

export default () =>
  server().catch((e) => {
    log.error(e)
    throw e
  })
