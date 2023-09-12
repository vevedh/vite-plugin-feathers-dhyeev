import { feathers } from '@feathersjs/feathers'
import { koa, rest, bodyParser, errorHandler } from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'
import { indexHtml } from './htmlContent.js'

// This is the interface for the message data
interface Message {
  id?: number
  text: string
}

// A messages service that allows us to create new
// and return all existing messages
class MessageService {
  messages: Message[] = []

  async find() {
    // Just return all our messages
    return this.messages
  }

  async create(data: Pick<Message, 'text'>) {
    // The new message is the data text with a unique identifier added
    // using the messages length since it changes whenever we add one
    const message: Message = {
      id: this.messages.length,
      text: data.text
    }

    // Add new message to the list
    this.messages.push(message)

    return message
  }
}

// This tells TypeScript what services we are registering
type ServiceTypes = {
  messages: MessageService
}

export const main = async () => {
  // Creates an ExpressJS compatible Feathers application
  const app = koa<ServiceTypes>(feathers())

  // Register the error handle
  app.use(errorHandler())
  // Parse JSON request bodies
  app.use(bodyParser())
  // Register REST service handler
  app.configure(rest())
  // Configure Socket.io real-time APIs
  app.configure(
    socketio({
      cors: {
        origin: '*'
      }
    })
  )
  // Use staic text hosting
  app.use((ctx) => {
    ctx.body = indexHtml
  })
  // Register our messages service
  app.use('messages', new MessageService())

  // Add any new real-time connection to the `everybody` channel
  app.on('connection', (connection) =>
    app.channel('everybody').join(connection)
  )
  // Publish all events to the `everybody` channel
  app.publish((_data) => app.channel('everybody'))

  // For good measure let's create a message
  // So our API doesn't look so empty
  app.service('messages').create({
    text: 'Hello world from the server!!!'
  })

  return app
}

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
