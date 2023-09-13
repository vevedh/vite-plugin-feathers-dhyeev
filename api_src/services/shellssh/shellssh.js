import { authenticate } from '@feathersjs/authentication'
import { ShellsshService, getOptions } from './shellssh.class.js'
import { shellsshPath, shellsshMethods } from './shellssh.shared.js'

export * from './shellssh.class.js'

// A configure function that registers the service and its hooks via `app.configure`
export const shellssh = (app) => {
  // Register our service on the Feathers application
  app.use(shellsshPath, new ShellsshService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: shellsshMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(shellsshPath).hooks({
    around: {
      all: [authenticate('jwt')]
    },
    before: {
      all: [],
      find: [],
      get: [],
      create: [],
      patch: [],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
