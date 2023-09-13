// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import   createSwaggerServiceOptions from 'feathers-swagger';
import { authenticate } from '@feathersjs/authentication'
import { ConfInfosService, getOptions } from './conf-infos.class.js'
import { confInfosPath, confInfosMethods } from './conf-infos.shared.js'

export * from './conf-infos.class.js'

// A configure function that registers the service and its hooks via `app.configure`
export const confInfos = (app) => {
  // Register our service on the Feathers application
  app.use(confInfosPath, new ConfInfosService(getOptions(app),app), {
    // A list of all methods this service exposes externally
    methods: confInfosMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs:  createSwaggerServiceOptions({
      schemas: {},
      docs: {
        description: 'My custom service description',
        securities: ['all'],
      }
    })
  })
  // Initialize hooks
  app.service(confInfosPath).hooks({
    around: {
      all: [] // authenticate('jwt')
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
