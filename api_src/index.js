import { feathers } from '@feathersjs/feathers'
import https from 'https'
import path from 'path'
import fsjetpack from 'fs-jetpack'
import fs from 'fs'
import { app } from './app.js'
import { logger } from './logger.js'

const port = app.get('port')
const host = app.get('host')
const fqdn = app.get('kerberos').fqdn

console.log('Mode :',process.env.NODE_ENV)
console.log('Chemin des certificats :',`/srv/certs/${fqdn}.pem`)


process.on('unhandledRejection', (reason) => logger.error('Unhandled Rejection %O', reason))

if (
  fsjetpack.exists(`/srv/certs/${fqdn}.pem`) == 'file' &&
  fsjetpack.exists(`/srv/certs/${fqdn}-key.pem`) == 'file'
) {

  if (process.env.NODE_ENV !== 'production') {
    app.listen(port).then(() => {
      logger.info(`Feathers app listening on http://${host}:${port}`)
    }).catch(err => { 
      logger.error('Unhandled Rejection %s', err)
    })
  } else {
    const server = https
    .createServer(
      {
        
        key: fs.readFileSync(`/srv/certs/${fqdn}-key.pem`),
        cert: fs.readFileSync(`/srv/certs/${fqdn}.pem`)
        //cert: fs.readFileSync(path.resolve()+path.join('/src/', `certs/cacem-racine.pem`))
      },
      app
    )
    .listen(443)


    // Call app.setup to initialize all services and SocketIO
    app.setup(server).catch(err => { 
      logger.error('Unhandled Rejection %s', err)
    })

    server.on('listening', () => logger.info(`Feathers application listening https://${fqdn}`))
    }
} else {

  app.listen(port).then(() => {
    logger.info(`Feathers app listening on http://${host}:${port}`)
  }).catch(err => { 
    logger.error('Unhandled Rejection %s', err)
  })


}
