// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { LdapSearchService, getOptions } from './ldap-search.class.js'
import { ldapSearchPath, ldapSearchMethods } from './ldap-search.shared.js'

export * from './ldap-search.class.js'

// A configure function that registers the service and its hooks via `app.configure`
export const ldapSearch = (app) => {
  // Register our service on the Feathers application
  app.use(ldapSearchPath, new LdapSearchService(getOptions(app),app), {
    // A list of all methods this service exposes externally
    methods: ldapSearchMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(ldapSearchPath).hooks({
    around: {
      all: [authenticate('jwt')] // authenticate('jwt')
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
