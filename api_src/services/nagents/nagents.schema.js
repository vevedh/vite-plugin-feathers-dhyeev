// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const nagentsSchema = {
  $id: 'Nagents',
  type: 'object',
  additionalProperties: false,
  required: ['id'],
  properties: {
    id: { type: 'number' },
    samaccount: { type: 'string' },
    email: { type: 'string' },
    nom: { type: 'string' },
    prenom: { type: 'string' },
    sexe: { type: 'string' },
    telephone: {
      type: 'array',
      items: [{type: "string"}, {type: "string"}],
      
    },
    actif: { type: 'boolean' },
    affectation: {
      type: 'object',
      properties: {
        fonction: {
          type: 'string'
        },
        service: {
          type: 'string'
        },
        dateExpiration: {
          type: 'string'
        }
      },
      required: ['fonction', 'service', 'dateExpiration']
    },
    localisation: {
      type: 'object',
      properties: {
        bureau: {
          type: 'string'
        },
        site: {
          type: 'string',
          description: 'site géographique sur lequel opère un agent',
          enum: ['siege', 'technopole', 'gpu', 'gcd', 'pepAgro', 'portEtangZabricots']
        }
      },
      required: ['bureau', 'site']
    }
  }
}
export const nagentsValidator = getValidator(nagentsSchema, dataValidator)
export const nagentsResolver = resolve({})

export const nagentsExternalResolver = resolve({})

// Schema for creating new data
export const nagentsDataSchema = {
  $id: 'NagentsData',
  type: 'object',
  additionalProperties: false,
  required: ['samaccount'],
  properties: {
    ...nagentsSchema.properties
  }
}
export const nagentsDataValidator = getValidator(nagentsDataSchema, dataValidator)
export const nagentsDataResolver = resolve({})

// Schema for updating existing data
export const nagentsPatchSchema = {
  $id: 'NagentsPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...nagentsSchema.properties
  }
}
export const nagentsPatchValidator = getValidator(nagentsPatchSchema, dataValidator)
export const nagentsPatchResolver = resolve({})

// Schema for allowed query properties
export const nagentsQuerySchema = {
  $id: 'NagentsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(nagentsSchema.properties)
  }
}
export const nagentsQueryValidator = getValidator(nagentsQuerySchema, queryValidator)
export const nagentsQueryResolver = resolve({})
