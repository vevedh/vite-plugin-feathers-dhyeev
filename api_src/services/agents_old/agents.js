// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import swagger from 'feathers-swagger'
import { authenticate } from '@feathersjs/authentication'
import { AgentsService, AgentsSubalternesService,AgentsResponsableService, getOptions } from './agents.class.js'
import { agentsPath, agentsMethods } from './agents.shared.js'

export * from './agents.class.js'



// A configure function that registers the service and its hooks via `app.configure`
export const agents = (app) => {
  // Register our service on the Feathers application
  app.use(agentsPath, new AgentsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: agentsMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: swagger.createSwaggerServiceOptions({
      schemas: {},
      docs: {
        description: 'A custom description'
      }
    })
  })


  app.use(agentsPath+'/:agentId', new AgentsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: agentsMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: swagger.createSwaggerServiceOptions({
      schemas: {},
      docs: {
        description: 'A custom description'
      }
    })
  })

  app.use(agentsPath+'/:agentId/subalternes', new AgentsSubalternesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: agentsMethods,//['getAgentId'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: swagger.createSwaggerServiceOptions({
      schemas: {},
      docs: {
        description: 'A custom description'
      }
    })
  })

  app.use(agentsPath+'/:agentId/responsable', new AgentsResponsableService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: agentsMethods,//['getAgentId'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: swagger.createSwaggerServiceOptions({
      schemas: {},
      docs: {
        description: 'A custom description'
      }
    })
  })
  

 /*

 createSwaggerServiceOptions({
      //schemas: { userSchema, userDataSchema, userPatchSchema, userQuerySchema },
      docs: {
          // any options for service.docs can be added here
          description: 'A description for the service',
          securities: ['find', 'get', 'patch', 'remove'],
      }
    }),

    */

  // Initialize hooks
  app.service(agentsPath).hooks({
    around: {
      all: [] // authenticate('jwt')
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
      get: [
        async (context) => {
          console.log('Data context', context.path);       
          if (String(context.arguments[0]).match(/\w*\d{1,}\w*/) == null) {
            if (String(context.arguments[0]).match(/\w*@\w*/) != null) {
              context.arguments[1].query = { mail: context.arguments[0]}
            } else {
              context.arguments[1].query = { sAMAccountName: context.arguments[0]}
            }
          }
          return context
        }
      ],
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

  app.service(agentsPath+'/:agentId/subalternes').hooks({
    around: {
      all: [] // authenticate('jwt')
    },
    before: {
      all: [],
      find: [
        async (context) => {
          console.log('Sub Data context', context.params);
          return []

        }
      ],
      get: [
        async (context) => {
          console.log('Sub Get Data context', context.path);       
         
        }
      ],
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

  app.service(agentsPath+'/:agentId/responsable').hooks({
    around: {
      all: [] // authenticate('jwt')
    },
    before: {
      all: [],
      find: [
        async (context) => {
          console.log('Sub Data context', context.params);
          return []

        }
      ],
      get: [
        async (context) => {
          console.log('Sub Get Data context', context.path);       
         
        }
      ],
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
