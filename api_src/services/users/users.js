// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import   createSwaggerServiceOptions from 'feathers-swagger';
import { authenticate } from '@feathersjs/authentication'
import {
  hooks
} from '@feathersjs/authentication-local';
//import { setField } from 'feathers-authentication-hooks';
import { UsersService, getOptions } from './users.class.js'
import { usersPath, usersMethods } from './users.shared.js'

export * from './users.class.js'

// A configure function that registers the service and its hooks via `app.configure`
export const users = (app) => {
  // Register our service on the Feathers application
  app.use(usersPath, new UsersService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: usersMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs:  createSwaggerServiceOptions({
      schemas: {},
      docs: {
        description: 'Mon service Utilisateur',
        securities: ['all'],
      }
    })
  })
  // Initialize hooks
  app.service(usersPath).hooks({
    around: {
      all: [],
      find: [authenticate('jwt')],//
      get: [authenticate('jwt')],
      create: [ hooks.hashPassword('password') ],
      update: [hooks.hashPassword('password'),authenticate('jwt')],
      patch: [hooks.hashPassword('password'),authenticate('jwt')],
      remove: [authenticate('jwt')]
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
      all: [hooks.protect('password')]
    },
    error: {
      all: []
    }
  })
}
