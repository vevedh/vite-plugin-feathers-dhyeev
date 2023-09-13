import { feathers } from '@feathersjs/feathers'
import path from 'path'
import express, {
  rest,
  json,
  urlencoded,
  cors,
  serveStatic,
  notFound,
  errorHandler
} from '@feathersjs/express'
import { AuthConfigure } from 'feathers-keycloak-connect-server'
import { MongoClient } from 'mongodb'
import dbMgmt from 'feathers-mongodb-management'
import ntlm from 'express-ntlm'
import history from 'connect-history-api-fallback'
import swagger from 'feathers-swagger'
import { powershell } from './powershell.js'
import configuration from '@feathersjs/configuration'
import { configurationValidator } from './configuration.js'
import socketio from '@feathersjs/socketio'
import { logger } from './logger.js'
import { ldap } from './ldap.js'

import { logError } from './hooks/log-error.js'
import { mongodb } from './mongodb.js'
import fs from 'fs'
import { authentication } from './authentication.js'

import { services } from './services/index.js'
import { channels } from './channels.js'

//const apiv1 = feathers()

//apiv1.use('service', myService)
export const main = async () => {
const app = express(feathers())

// Load app configuration
app.configure(configuration(configurationValidator))
app.use(
  cors({
    origin: ['http://localhost:3030','http://localhost:9000','*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    //preflightContinue: true,
    //credentials: true,
    //origin: req.headers.origin,
    optionsSuccessStatus: 204
  })
)
app.use(json())
app.use(urlencoded({ extended: true }))
/*
app.get('/api/v1/agents/:agentId',async (req,res,next) => {
  console.log('Agent ID :',req.params.agentId)
  let agentId = Object.assign({},{ query: { sAMAccountName: req.params.agent }})

  console.log('Agent ID :',agentId)
  const agent = await app.service('/api/v1/agents').find({ query: { sAMAccountName: req.params.agent }})

  res.json(agent)
})
app.get('/api/v1/agents/:agentId/subalternes',async (req,res,next) => {
  console.log('Agent ID :',req.params.agentId)
  const agentDn = (await app.service('/api/v1/agents').find({ query: { sAMAccountName:'hdechavigny'}}))[0].distinguishedName

  const agents = await app.service('/api/v1/agents').find({ query: { manager:agentDn}})

  res.json(agents)
})
*/
app.get(
  '/api/sso',
  ntlm({
    debug: function () {
      var args = Array.prototype.slice.apply(arguments)
      console.log.apply(null, args)
    },
    domain: String(app.get('dc')).split('.')[1] + '.' + String(app.get('dc')).split('.')[2],
    domaincontroller: `ldaps://${app.get('dc')}:636`,
    tlsOptions: {
      //trusted certificate authorities (can be extracted from the server with openssh)
      ca: fs.readFileSync(app.get('authentication').ldap.certca)
      //tells the tls module not to check the server's certificate (do not use in production)
      //rejectUnauthorized: false,
    }
  }),
  (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    if (req.ntlm) {
      console.log('NTLM :', req.ntlm)
      res.json({
        domain: req.ntlm.DomainName,
        username: req.ntlm.UserName,
        authenticated: req.ntlm.Authenticated,
        workstation: req.ntlm.Workstation
      })
    }
    //res.send(`Hello ${req.auth.username}!`);
  }
)
logger.info('Web local path : %s',path.join('/src/', app.get('public')))
logger.info('Web serveur : %s', path.join('/src/', app.get('public')))

app.use(
  '/',
  history({
    verbose: false,
    rewrites: [
      
      {
        from: /^\/auth\/.*$/,
        to: function (context) {
          return context.parsedUrl.path
        }
      },
      {
        from: /^\/oauth\/.*$/,
        to: function (context) {
          return context.parsedUrl.path
        }
      },
      {
        from: /^\/users$/,
        to: function (context) {
          return context.parsedUrl.path
        }
      },
      {
        from: /^\/api\/.*$/,
        to: function (context) {
          return context.parsedUrl.path
        }
      },
      {
        from: /^\/api\/checkdb\/.*$/,
        to: function (context) {
          return context.parsedUrl.path
        }
      },
      {
        from: /^\/api\/\/v1\/\/agents\/.*$/,
        to: function (context) {
          return context.parsedUrl.path
        }
      },
      {
        from: /^\/mongo\/.*$/,
        to: function (context) {
          return context.parsedUrl.path
        }
      },
      {
        from: /^\/mongo\/\/databases\/.*$/,
        to: function (context) {
          return context.parsedUrl.path
        }
      }
    ]
  })
)

//app.use('/', serveStatic(path.join('/src/', app.get('public'))))
app.use('/', serveStatic(app.get('public')))
/*app.use('/',history({
  verbose: false
}))*/

// Configure services and real-time functionality
app.configure(swagger.customMethodsHandler)
app.configure(rest())
app.configure(socketio())
app.configure(mongodb)
app.configure(ldap)
app.configure(powershell)
app.configure(authentication)
//app.configure(AuthConfigure({serverUrl:'https://svrkeycloak.agglo.local:8443',realm:'CACEM', clientId:'account-console',userService:'users',serviceIdField:'_id'}))

//const keycloak = app.get('keycloak')
//console.log('Keycloak :',keycloak)
//console.log('Mongo management :', dbMgmt)
const database = new URL(app.get('mongodb')).pathname.substring(1)
const cnxurl = new URL(app.get('mongodb')).protocol + '//' + new URL(app.get('mongodb')).host
logger.info('Mongo url : %s', cnxurl)
logger.info('Current db : %s', database)

/*
if (database && database !== '') {
  const client = await MongoClient.connect(cnxurl)
  app.use('/mongo/databases', dbMgmt.database({ adminDb: client.db().admin(), client }));
  const db = client.db(database);
  // Now create services binded to this database to manage collections/users
  app.use('/mongo/'+database+'/collections', dbMgmt.collection({ db }));
}
*/
app.configure(
  swagger({
    openApiVersion: 3,
    prefix: 'api/v1',
    docsJsonPath: '/swagger.json',
    ui: swagger.swaggerUI({ docsPath: '/api/docs' }),  
    specs: {
      
      info: {
        title: 'CACEM  API Rest services local',
        description: 'Serveur API REST de la CACEM',
        version: '1.0.0'
      },
      schemes: ['http', 'https'],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'https',
            scheme: 'bearer'
          }
        }
      },
      security: {
        name: "jwt",
        type: "apiKey",
        in: "header"
      },
      securityDefinitions: {
        jwt: {
          type: "apiKey",
          name: "Authorization",
          in: "header"
        }
      },
      paths: {
        '/agents': {
          get: {
            tags: ['agents'],
            summary: "Recupere l'ensemble des agents de la collectivité",
            operationId: 'getAllAgents',
            parameters: [
              {
                name: 'site',
                in: 'query',
                description: 'nom du site pour lequel filtrer les agents',
                required: false,
                style: 'form',
                explode: true,
                schema: {
                  type: 'string',
                  enum: ['siege', 'technopole', 'gpu', 'gcd', 'pepAgro', 'portEtangZabricots']
                }
              },
              {
                name: 'service',
                in: 'query',
                description: 'unite administrative pour lequel filtrer les agents',
                required: false,
                style: 'form',
                explode: true,
                schema: {
                  type: 'string'
                }
              }
            ],
            responses: {
              200: {
                description: 'operation réussie',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: {
                        //$ref: '#/components/schemas/Agent'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '/agents/{agentId}': {
          get: {
            tags: ['agents'],
            summary: 'Recupere les informations propres à un agent',
            description: 'retourne un Agent',
            operationId: 'getAgentById',
            parameters: [
              {
                name: 'agentId',
                in: 'path',
                description: "courriel ou samaccount de l'agent à renvoyer",
                required: true,
                style: 'simple',
                explode: false,
                schema: {
                  type: 'string'
                }
              }
            ],
            responses: {
              200: {
                description: 'operation reussie',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Agent'
                    }
                  },
                  'application/xml': {
                    schema: {
                      $ref: '#/components/schemas/Agent'
                    }
                  }
                }
              },
              400: {
                description: 'ID incorrect'
              },
              404: {
                description: 'Agent non trouvé'
              }
            },
            security: [
              {
                api_key: []
              }
            ]
          }
        },
        '/agents/{agentId}/responsable': {
          get: {
            tags: ['agents'],
            summary: 'Trouve le superieur hiérarchique',
            description: "retourne le supérieur hiérarchique de l'agent reference par son Id",
            operationId: 'getAgentSupById',
            parameters: [
              {
                name: 'agentId',
                in: 'path',
                description: "courriel ou samaccount de l'agent à renvoyer",
                required: true,
                style: 'simple',
                explode: false,
                schema: {
                  type: 'string'
                }
              }
            ],
            responses: {
              200: {
                description: 'opération réussie',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Agent'
                    }
                  },
                  'application/xml': {
                    schema: {
                      $ref: '#/components/schemas/Agent'
                    }
                  }
                }
              },
              400: {
                description: 'ID incorrect'
              },
              404: {
                description: 'Agent non trouvé'
              }
            },
            security: [
              {
                api_key: []
              }
            ]
          }
        },
        '/agents/{agentId}/subalternes': {
          get: {
            tags: ['agents'],
            summary: "Trouve les subalternes d'un agent",
            description: "retourne l'ensemble des subalternes d'un agent reference par son Id",
            operationId: 'getAgentInfById',
            parameters: [
              {
                name: 'agentId',
                in: 'path',
                description: "courriel ou samaccount de l'agent à renvoyer",
                required: true,
                style: 'simple',
                explode: false,
                schema: {
                  type: 'string'
                }
              }
            ],
            responses: {
              200: {
                description: 'operation reussie',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Agent'
                    }
                  },
                  'application/xml': {
                    schema: {
                      $ref: '#/components/schemas/Agent'
                    }
                  }
                }
              },
              400: {
                description: 'ID incorrect'
              },
              404: {
                description: 'Agent(s) non trouve(s)'
              }
            },
            security: [
              {
                api_key: []
              }
            ]
          }
        }
      }
    }
  })
)
app.configure(services)
app.configure(channels)

//const agentLookup = app.lookup('api/v1/agents/:agentId')

// Configure a middleware for 404s and the error handler
app.use(notFound({ verbose: true }))
app.use(
  errorHandler({
    html: {
      404: path.resolve() + '/www/error404.html',
      401: path.resolve() + '/www/error401.html'
    },
    logger
  })
)

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})
app.use(
  '/',
  history({
    verbose: false
  })
)
return app
}


//export { app }
// Bootstrap
if (import.meta?.url?.endsWith(process.argv[1])) {
  process.on('unhandledRejection', (reason, p) =>
    console.warn('[index.ts] Unhandled Rejection at: Promise ', p, reason)
  )
  const { main } = await import('./app.js')
  const app = await main()
  const port = app.get('port') || '3030'
  await app.listen(port)
  console.info('Feathers application started on http://%s:%d', port)
}