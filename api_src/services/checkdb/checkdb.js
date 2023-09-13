// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { CheckdbService, getOptions } from './checkdb.class.js'
import { checkdbPath, checkdbMethods } from './checkdb.shared.js'

export * from './checkdb.class.js'

// A configure function that registers the service and its hooks via `app.configure`
export const checkdb = (app) => {
  // Register our service on the Feathers application
  app.use(checkdbPath, new CheckdbService(getOptions(app),app), {
    // A list of all methods this service exposes externally
    methods: checkdbMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(checkdbPath).hooks({
    around: {
      all: [] //authenticate('jwt')
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
