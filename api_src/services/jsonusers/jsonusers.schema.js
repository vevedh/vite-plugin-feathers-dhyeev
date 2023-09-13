// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const jsonusersSchema = {
  $id: 'Jsonusers',
  type: 'object',
  additionalProperties: false,
  required: ['_id', 'text'],
  properties: {
    _id: ObjectIdSchema(),
    text: { type: 'string' }
  }
}
export const jsonusersValidator = getValidator(jsonusersSchema, dataValidator)
export const jsonusersResolver = resolve({})

export const jsonusersExternalResolver = resolve({})

// Schema for creating new data
export const jsonusersDataSchema = {
  $id: 'JsonusersData',
  type: 'object',
  additionalProperties: false,
  required: ['text'],
  properties: {
    ...jsonusersSchema.properties
  }
}
export const jsonusersDataValidator = getValidator(jsonusersDataSchema, dataValidator)
export const jsonusersDataResolver = resolve({})

// Schema for updating existing data
export const jsonusersPatchSchema = {
  $id: 'JsonusersPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...jsonusersSchema.properties
  }
}
export const jsonusersPatchValidator = getValidator(jsonusersPatchSchema, dataValidator)
export const jsonusersPatchResolver = resolve({})

// Schema for allowed query properties
export const jsonusersQuerySchema = {
  $id: 'JsonusersQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(jsonusersSchema.properties)
  }
}
export const jsonusersQueryValidator = getValidator(jsonusersQuerySchema, queryValidator)
export const jsonusersQueryResolver = resolve({})
