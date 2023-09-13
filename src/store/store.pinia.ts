// store/store.pinia.ts
import { createPinia } from 'pinia'
import { setupFeathersPinia } from 'feathers-pinia'
import { api } from '../feathers.js'

export const pinia = createPinia()

export const { defineStore, BaseModel } = setupFeathersPinia({
  clients: { api },
  idField: 'id',
  //ssr: false,
    whitelist: [],
    //paramsForServer: [],
    //skipGetIfExists: true,
    customSiftOperators: {},
    setupInstance(data) {
      return data
    },
    customizeStore(defaultStore) {
      return {}
    },
    services: {},
})
