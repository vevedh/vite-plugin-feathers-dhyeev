// This is a skeleton for a custom service class. Remove or add the methods you need here
import path from 'path'
import fsjetpack from 'fs-jetpack'

export class ConfInfosService {
  constructor(options,app) {
    this.options = options || {}
    this.app = app || {}
  }

  async find(_params) {
    //_params.query = {};
   
    return new Promise((resolve) => {
      if (Object.keys(_params.query).length == 0) {
        const conf = fsjetpack.read(path.resolve('./config/default.json'), 'utf8');
        if (conf) {
          //console.log('Config :',conf)
          resolve([JSON.parse(conf)]);
        } else {
          resolve([])
        }
      } else if (Object.keys(_params.query).includes('services')) {
        console.log('Services :', Object.keys(this.app.service('api/v1/agents')))
        const servs = Object.keys(this.app.services).map((s) => { return { name: `${s}`}})
        resolve(servs)
      } else {
        resolve([])
      }

    })
    
    
  }

  async get(id, _params) {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }
  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id, data, _params) {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id, data, _params) {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id, _params) {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app) => {
  return { app }
}
