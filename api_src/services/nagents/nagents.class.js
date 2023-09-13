// This is a skeleton for a custom service class. Remove or add the methods you need here
import feathersSwagger from 'feathers-swagger'

export class NagentsService {
  constructor(options) {
    this.options = options
  }

  async find(_params) {
    return []
  }

  async get(id, _params) {
    return {
      id: 0,
      samaccount: 'hgdesorm',
      email: 'hgdesorm@cacem.fr',
      nom: 'GD',
      prenom: 'Hari',
      sexe: 'homme',
      telephone: ['+596 696 66 77 88', '+596 596 12 34 56'],
      actif: true,
      affectation: {
        fonction: 'string',
        service: 'string',
        dateExpiration: '2023-06-20T17:00:00-04:00'
      },
      localisation: {
        bureau: 'string',
        site: 'siege'
      }
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
      samaccount: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id, _params) {
    return {
      id: 0,
      samaccount: 'removed'
    }
  }
  async subalterne(data, _params) {
    return { data, queryParams: params.query, routeParams: params.route };
  }
}

export const getOptions = (app) => {
  return { app }
}
