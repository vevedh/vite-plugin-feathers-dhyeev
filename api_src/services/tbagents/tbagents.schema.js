// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const agentsSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    dn: Type.String(),
    objectClass: Type.Array(),
    cn: Type.String(),
    sn: Type.String(),
    title: Type.String(),
    description: Type.String(),
    physicalDeliveryOfficeName: Type.String(),
    telephoneNumber: Type.String(),
    givenName: Type.String(),
    distinguishedName: Type.String(),
    instanceType: Type.String(),
    whenCreated: Type.String(),
    whenChanged: Type.String(),
    displayName: Type.String(),
    uSNCreated: Type.String(),
    memberOf: Type.Union([Type.String(), Type.Array()]),
    uSNChanged: Type.String(),
    department: Type.String(),
    company: Type.String(),
    proxyAddress: Type.Array(),
    directReports: Type.String(),
    name: Type.String(),
    objecGUID: Type.String(),
    userAccountControl: Type.String(),
    badPwdCount: Type.String(),
    codePage: Type.String(),
    countryCode: Type.String(),
    badPasswordTime: Type.String(),
    lastLogon: Type.String(),
    pwdLastSet: Type.String(),
    primaryGroupID: Type.String(),
    objectSid: Type.String(),
    accountExpires: Type.String(),
    logonCount: Type.String(),
    sAMAccountName: Type.String(),
    sAMAccountType: Type.String(),
    showInAddressBook: Type.Array(Type.String()),
    legacyExchangeDN: Type.String(),
    userPrinciaplName: Type.String(),
    lockoutTime: Type.String(),
    ipPhone: Type.String(),
    objectCategory: Type.String(),
    dSCorePropagationData: Type.Array(Type.String()),
    lastLogonTimestamp: Type.String(),
    msTSExpireDate: Type.String()




  },
  { $id: 'Agents', additionalProperties: false }
)
export const agentsValidator = getValidator(agentsSchema, dataValidator)
export const agentsResolver = resolve({})

export const agentsExternalResolver = resolve({})

// Schema for creating new entries
export const agentsDataSchema = Type.Pick(agentsSchema, ['text'], {
  $id: 'AgentsData'
})
export const agentsDataValidator = getValidator(agentsDataSchema, dataValidator)
export const agentsDataResolver = resolve({})

// Schema for updating existing entries
export const agentsPatchSchema = Type.Partial(agentsSchema, {
  $id: 'AgentsPatch'
})
export const agentsPatchValidator = getValidator(agentsPatchSchema, dataValidator)
export const agentsPatchResolver = resolve({})

// Schema for allowed query properties
export const agentsQueryProperties = Type.Pick(agentsSchema, ['_id', 'text'])
export const agentsQuerySchema = Type.Intersect(
  [
    querySyntax(agentsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const agentsQueryValidator = getValidator(agentsQuerySchema, queryValidator)
export const agentsQueryResolver = resolve({})
