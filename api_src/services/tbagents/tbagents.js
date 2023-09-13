// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  agentsDataValidator,
  agentsPatchValidator,
  agentsQueryValidator,
  agentsResolver,
  agentsExternalResolver,
  agentsDataResolver,
  agentsPatchResolver,
  agentsQueryResolver
} from './tbagents.schema.js'
import { AgentsService, getOptions } from './tbagents.class.js'
import { agentsPath, agentsMethods } from './tbagents.shared.js'

export * from './tbagents.class.js'
export * from './tbagents.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const agents = (app) => {
  // Register our service on the Feathers application
  app.use(agentsPath, new AgentsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: agentsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(agentsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(agentsExternalResolver),
        schemaHooks.resolveResult(agentsResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(agentsQueryValidator), schemaHooks.resolveQuery(agentsQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(agentsDataValidator), schemaHooks.resolveData(agentsDataResolver)],
      patch: [schemaHooks.validateData(agentsPatchValidator), schemaHooks.resolveData(agentsPatchResolver)],
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
