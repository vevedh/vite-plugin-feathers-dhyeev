// src/feathers.ts
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
//import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
// import { iff, discard } from 'feathers-hooks-common'

const url = import.meta.env.SOCKET_URL
const socket = io(url, { transports: ['websocket'] })

// This variable name becomes the alias for this server.
export const api = feathers().configure(socketio(socket))
// .configure(auth({ storage: window.localStorage }))

const result = await api.service('messages').find({ query: {} })
console.log(result)
