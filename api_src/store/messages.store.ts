import { defineStore, BaseModel } from './store.pinia.js'
import { api } from '../feathers.js'

export class Messages extends BaseModel {}

const servicePath = 'messages'
export const useMessages = defineStore({ servicePath, Model: Messages })

api.service(servicePath).hooks({})
