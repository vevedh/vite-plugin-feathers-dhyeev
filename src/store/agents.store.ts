import { defineStore, BaseModel } from './store.pinia.js'
import { api } from '../feathers.js'

export class Agents extends BaseModel {}

const servicePath = 'api/v1/agents'
export const useAgents = defineStore({ servicePath, Model: Agents })

api.service(servicePath).hooks({})
