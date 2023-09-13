// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const messagesSchema = Type.Object(
  {
    id: ObjectIdSchema(),
    text: Type.String(),
    createdAt: Type.Number(),
    userId: Type.Number(),
    user: Type.Any()
  },
  { $id: 'Messages', additionalProperties: false }
)
export const messagesValidator = getValidator(messagesSchema, dataValidator)
export const messagesResolver = resolve({
  user: virtual(async (message, context) => {
    // Associate the user that sent the message
    return context.app.service('users').get(message.userId)
  })
})

export const messagesExternalResolver = resolve({})

// Schema for creating new entries
export const messagesDataSchema = Type.Pick(messagesSchema, ['text'], {
  $id: 'MessagesData'
})
export const messagesDataValidator = getValidator(messagesDataSchema, dataValidator)
export const messagesDataResolver = resolve({
  userId: async (_value, _message, context) => {
    console.log('User :',context.params.user)
    // Associate the record with the id of the authenticated user
    return context.params.user.id
  },
  createdAt: async () => {
    return Date.now()
  }
})

// Schema for updating existing entries
export const messagesPatchSchema = Type.Partial(messagesSchema, {
  $id: 'MessagesPatch'
})
export const messagesPatchValidator = getValidator(messagesPatchSchema, dataValidator)
export const messagesPatchResolver = resolve({})

// Schema for allowed query properties
export const messagesQueryProperties = Type.Pick(messagesSchema, ['id', 'text','createAt','userId','user'])
export const messagesQuerySchema = Type.Intersect(
  [
    querySyntax(messagesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const messagesQueryValidator = getValidator(messagesQuerySchema, queryValidator)
export const messagesQueryResolver = resolve({
  userId: async (value, user, context) => {
    // We want to be able to find all messages but
    // only let a user modify their own messages otherwise
    if (context.params.user && context.method !== 'find') {
      return context.params.user.id
    }

    return value
  }
})
