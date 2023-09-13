import { authenticate } from '@feathersjs/authentication'
import { AgentsService,  getOptions} from './agents.class.js'
import { agentsPath, agentsMethods } from './agents.shared.js'
import { hooks } from 'feathers-keycloak-connect-server'

export * from './agents.class.js'

// A configure function that registers the service and its hooks via `app.configure`
export const agents = (app) => {

  const agentsService =new AgentsService(getOptions(app),app)

  agentsService.docs = {
    description: '<b>API</b>  Agents',
    definition: {
      type: 'object',
      required: [
      'text'
      ],
      properties: {
        text: {
          type: 'string',
          description: 'The message text'
        },
        userId: {
          type: 'string',
          description: 'The id of the user that send the message'
        }
      }
    }
  };

  // Register our service on the Feathers application
  app.use(agentsPath,agentsService , {
    // A list of all methods this service exposes externally
    methods: agentsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })

  app.use(agentsPath+'/:agentId/subalternes', new AgentsService(getOptions(app),app), {
    // A list of all methods this service exposes externally
    methods: agentsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })

  app.use(agentsPath+'/:agentId/responsable', new AgentsService(getOptions(app),app), {
    // A list of all methods this service exposes externally
    methods: agentsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })

  //app.use(agentsPath, new AgentsService({ id:'samacount'}))


  

  // Initialize hooks
  app.service(agentsPath).hooks({
    around: {
      all: [ ]  //authenticate('jwt') hooks.protect()
    },
    before: {
      all: [],
      find: [
        async (context) => {
          console.log('Data context', context.params);
          console.log('Data  path', context.path);
          if (context.params.query.init=='') {
            console.log('faire une initialisation avant')
            await context.self.initDB()
            if (context.params.query.hasOwnProperty('init')) delete context.params.query['init'];
          }
          
        }
      ],
      get: [
        async (context) => {
          console.log('Get context', context);
          
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
      all: [authenticate('jwt')]
    },
    before: {
      all: [],
      find: [
        async (context) => {
          console.log('Data context', context.params);
          console.log('Data  path', context.path);
          console.log('Datas size:',context.data);
          if (context.params.query.init=='') {
            console.log('faire une initialisation avant')
            await context.self.initDB()
            if (context.params.query.hasOwnProperty('init')) delete context.params.query['init'];
          }
          if (Object(context.params.route).hasOwnProperty('agentId')) {
            if (String(context.params.route.agentId).match(/\w*\d{1,}\w*/) == null) {
              if (String(context.params.route.agentId).match(/\w*@\w*/) != null) {
                  // si c'est agentId est un email
                  const dn = (await context.app.service('api/v1/ldapusers').find({query: { mail: context.params.route.agentId}})).data[0].distinguishedName
                  const subalternes = (await context.app.service('api/v1/ldapusers').find({query: { manager: dn }})).data.map((o) => {
                    return o.sAMAccountName
                  })
                  // liste des subalternes
                  console.log('liste des subalternes :', subalternes)
                  context.params.query = { ...context.params.query ,samacount: { $in: subalternes}} 
                
                
              } else {
                const dn = (await context.app.service('api/v1/ldapusers').find({query: { sAMAccountName: context.params.route.agentId}})).data[0].distinguishedName
                const subalternes = (await context.app.service('api/v1/ldapusers').find({query: { manager: dn }})).data.map((o) => {
                  return o.sAMAccountName
                })
                context.params.query = { ...context.params.query ,samacount: { $in: subalternes}}  
              }
              return context
            } else {
              const dn = (await context.app.service('api/v1/ldapusers').find({query: { _id: context.params.route.agentId}})).data[0].distinguishedName
                const subalternes = (await context.app.service('api/v1/ldapusers').find({query: { manager: dn }})).data.map((o) => {
                  return o.sAMAccountName
                })
              context.params.query = { ...context.params.query ,samacount: { $in: subalternes}} 
              return context
            }
          }
          
        }
      ],
      get: [
        async (context) => {
          console.log('Get context', context);
          
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
      all: [authenticate('jwt')]
    },
    before: {
      all: [],
      find: [
        async (context) => {
          console.log('Data context', context.params);
          console.log('Data  path', context.path);
          console.log('Datas size:',context.data);
          if (context.params.query.init=='') {
            console.log('faire une initialisation avant')
            await context.self.initDB()
            if (context.params.query.hasOwnProperty('init')) delete context.params.query['init'];
          }
          if (Object(context.params.route).hasOwnProperty('agentId')) {
            if (String(context.params.route.agentId).match(/\w*\d{1,}\w*/) == null) {
              if (String(context.params.route.agentId).match(/\w*@\w*/) != null) {
                  // si c'est agentId est un email
                  const dn = (await context.app.service('api/v1/ldapusers').find({query: { mail: context.params.route.agentId}})).data[0].manager
                  const subalternes = (await context.app.service('api/v1/ldapusers').find({query: { distinguishedName: dn }})).data.map((o) => {
                    return o.sAMAccountName
                  })
                  // liste des subalternes
                  console.log('liste des subalternes :', subalternes)
                  context.params.query = { ...context.params.query ,samacount: { $in: subalternes}} 
                
                
              } else {
                //  si agentId est un nom
                const dn = (await context.app.service('api/v1/ldapusers').find({query: { sAMAccountName: context.params.route.agentId}})).data[0].manager
                const subalternes = (await context.app.service('api/v1/ldapusers').find({query: { distinguishedName: dn }})).data.map((o) => {
                  return o.sAMAccountName
                })
                context.params.query = { ...context.params.query ,samacount: { $in: subalternes}}  
              }
              return context
            } else {
              // si agentId comporte un chiffre
              const dn = (await context.app.service('api/v1/ldapusers').find({query: { _id: context.params.route.agentId}})).data[0].manager
                const subalternes = (await context.app.service('api/v1/ldapusers').find({query: { distinguishedName: dn }})).data.map((o) => {
                  return o.sAMAccountName
                })
              context.params.query = { ...context.params.query ,samacount: { $in: subalternes}} 
              return context
            }
          }
          
        }
      ],
      get: [
        async (context) => {
          console.log('Get context', context);
          
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
