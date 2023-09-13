// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  jsonusersDataValidator,
  jsonusersPatchValidator,
  jsonusersQueryValidator,
  jsonusersResolver,
  jsonusersExternalResolver,
  jsonusersDataResolver,
  jsonusersPatchResolver,
  jsonusersQueryResolver
} from './jsonusers.schema.js'
import { JsonusersService, getOptions } from './jsonusers.class.js'
import { jsonusersPath, jsonusersMethods } from './jsonusers.shared.js'

export * from './jsonusers.class.js'
export * from './jsonusers.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const jsonusers = (app) => {
  // Register our service on the Feathers application
  app.use(jsonusersPath, new JsonusersService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: jsonusersMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(jsonusersPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(jsonusersExternalResolver),
        schemaHooks.resolveResult(jsonusersResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(jsonusersQueryValidator),
        schemaHooks.resolveQuery(jsonusersQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(jsonusersDataValidator),
        schemaHooks.resolveData(jsonusersDataResolver)
      ],
      patch: [
        schemaHooks.validateData(jsonusersPatchValidator),
        schemaHooks.resolveData(jsonusersPatchResolver)
      ],
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
