// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import feathersSwagger from 'feathers-swagger'
import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  nagentsSchema,
  nagentsQuerySchema,
  nagentsDataSchema,
  nagentsPatchSchema
} from './nagents.schema.js'
import {
  nagentsDataValidator,
  nagentsPatchValidator,
  nagentsQueryValidator,
  nagentsResolver,
  nagentsExternalResolver,
  nagentsDataResolver,
  nagentsPatchResolver,
  nagentsQueryResolver
} from './nagents.schema.js'
import { NagentsService, getOptions } from './nagents.class.js'
import { nagentsPath, nagentsMethods } from './nagents.shared.js'

export * from './nagents.class.js'
export * from './nagents.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const nagents = (app) => {
  // Register our service on the Feathers application
  app.use(nagentsPath, new NagentsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: nagentsMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: feathersSwagger.createSwaggerServiceOptions({
      schemas: { nagentsDataSchema, nagentsQuerySchema, nagentsSchema },
      docs: {
        description: "Fonctionnalites permettant de requeter le SI autour d'un agent territorial",
        tags: ['agents'],
       
      }
    })
  })

  /*app.use(nagentsPath+'/{agentId}/subalterne', new NagentsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: nagentsMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: feathersSwagger.createSwaggerServiceOptions({
      schemas: {nagentsDataSchema, nagentsQuerySchema, nagentsSchema},
      docs: {
        description: 'Agent A custom description'
      }
    })
  })*/
  // Initialize hooks
  app.service(nagentsPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(nagentsExternalResolver), schemaHooks.resolveResult(nagentsResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(nagentsQueryValidator), schemaHooks.resolveQuery(nagentsQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(nagentsDataValidator), schemaHooks.resolveData(nagentsDataResolver)],
      patch: [schemaHooks.validateData(nagentsPatchValidator), schemaHooks.resolveData(nagentsPatchResolver)],
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
