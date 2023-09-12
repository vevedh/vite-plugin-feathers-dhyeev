// Without this, old JWT tokens for non existen users will crash us
process.on('unhandledRejection', (reason, p) =>
  console.warn('[index.ts] Unhandled Rejection at: Promise ', p, reason)
)

// Close previous port and open it again
const listenGlobal = globalThis as any

// A function that creates messages and then logs
// all existing messages on the service
export const bootServer = async ({ vite }: any = {}) => {
  console.log('STARTING SERVER')
  const { configureApp } = await import('./app.js')
  const app = await configureApp()
  const server = listenGlobal.FeathersServer as any
  const port = app.get('port') || '3030'
  if (server === undefined || server.close()) {
    listenGlobal.FeathersServer = await app.listen(port)
    console.info('Feathers application started on http://%s:%d', port)
  }
  return app
}

import.meta?.hot?.accept('./app', (newFoo) => {
  console.log('FEATHERS APP.TS HMR POSSIBLE')
})

// Bootstrap
if (import.meta?.url?.endsWith(process.argv[1])) {
  await bootServer()
}
