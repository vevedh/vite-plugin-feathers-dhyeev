import { authenticate } from '@feathersjs/authentication'
import { DbagentsService, getOptions } from './dbagents.class.js'
import { dbagentsPath, dbagentsMethods } from './dbagents.shared.js'

export * from './dbagents.class.js'

// A configure function that registers the service and its hooks via `app.configure`
export const dbagents = (app) => {
  // Register our service on the Feathers application
  app.use(dbagentsPath, new DbagentsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: dbagentsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(dbagentsPath).hooks({
    around: {
      all: [authenticate('jwt')]
    },
    before: {
      all: [],
      find: [],
      get: [],
      create: [],
      patch: [],
      remove: [],
      init: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
