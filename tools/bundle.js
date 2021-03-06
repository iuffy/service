import webpack from 'webpack'
import webpackConfig from './webpack.config'
import check from './check'

function bundle({ watching } = {}) {
  return new Promise((resolve, reject) => {
    const bundler = webpack(webpackConfig)
    const onComplete = async (err, stats) => {
      if (err) return reject(err)
      console.log(stats.toString(webpackConfig[0].stats))
      if (!watching || stats.compilation.outputOptions.filename === 'server.js') {
        await check('iuffy-model')
        return resolve(bundler)
      }
    }
    if (watching) bundler.watch(200, onComplete)
    else bundler.run(onComplete)
  })
}

export default bundle
