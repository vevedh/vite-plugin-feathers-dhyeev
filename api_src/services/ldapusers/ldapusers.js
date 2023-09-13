import { authenticate } from '@feathersjs/authentication'
import { LdapusersService, getOptions } from './ldapusers.class.js'
import { ldapusersPath, ldapusersMethods } from './ldapusers.shared.js'

export * from './ldapusers.class.js'

// A configure function that registers the service and its hooks via `app.configure`
export const ldapusers = (app) => {
  // Register our service on the Feathers application
  app.use(ldapusersPath, new LdapusersService(getOptions(app),app), {
    // A list of all methods this service exposes externally
    methods: ldapusersMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(ldapusersPath).hooks({
    around: {
      all: [authenticate('jwt')]
    },
    before: {
      all: [],
      find: [
        async (context) => {
          console.log('Data context', context.params);
          if (context.params.query.init=='') {
            console.log('faire une initialisation avant')
            await context.self.initDB()
            if (context.params.query.hasOwnProperty('init')) delete context.params.query['init'];
           
          }
          

        }
      ],
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
