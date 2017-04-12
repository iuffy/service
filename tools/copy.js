import path from 'path'
import Promise from 'bluebird'
import * as fs from './lib/fs'
import watch from './lib/watch'
import pkg from '../package.json'

async function copy({ watching } = {}) {
  const ncp = Promise.promisify(require('ncp'))
  await fs.makeDir('build/node_modules/iuffy-model')

  const env = !process.argv.includes('release') ? 'development' : 'production'
  const deploying = process.argv.includes('deploy')
  const FORCE = process.argv.includes('force')

  const cps = [
    ncp('node_modules/iuffy-model/dist', 'build/node_modules/iuffy-model/dist'),
    ncp(
      'node_modules/iuffy-model/package.json',
      'build/node_modules/iuffy-model/package.json',
    ),
  ]

  if (!deploying || FORCE) {
    cps.push(ncp('support/pm2/iuffy-service.json', 'build/iuffy-service.json'))
    cps.push(ncp(`src/config/${env}.json`, 'build/config.json'))
  }

  await Promise.all(cps)

  // 随部署发布，无需再次安装
  delete pkg.dependencies['iuffy-model']

  await fs.writeFile('./build/package.json', JSON.stringify({
    private: true,
    engines: pkg.engines,
    dependencies: pkg.dependencies,
    scripts: {
      start: 'node server.js',
    },
  }, null, 2))

  if (watching) {
    const watcher = await watch([
      `src/config/${env}.json`,
      'node_modules/iuffy-model/dist/*.*',
    ])

    const cp = async (file) => {
      if (file.indexOf('iuffy-model') !== -1) {
        const relPath = file.substr(path.join(__dirname, '../').length)
        await ncp(relPath, `build/${relPath}`)
      } else if (file.indexOf(`src/config/${env}.json`) !== -1) {
        await ncp(file, 'build/config.json')
      } else {
        const relPath = file.substr(path.join(__dirname, '../src/').length)
        await ncp(`src/${relPath}`, `build/${relPath}`)
      }
    }

    watcher.on('changed', cp)
    watcher.on('added', cp)
  }
}

export default copy
