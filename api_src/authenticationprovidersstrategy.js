import _ from 'lodash'
import { OAuthStrategy } from '@feathersjs/authentication-oauth'

export class AuthenticationProviderStrategy extends OAuthStrategy {


async getRedirect (data,params) {
  
  console.log('Redirect data  :',data)
  console.log('Redirect params  :',params)
  return "https://svrapi.agglo.local/oauth/keycloak/callback"
}



  async getEntityData (profile, entity,params) {

    console.log('Profile  :',profile)
    const baseData = await super.getEntityData(profile)
    console.log('Entity base data :',baseData)
    const createEntity = _.isNil(entity)
    console.log('Entity  params:',params)
    console.log('Data Name  :',this.name)
    // Add provider Id
    entity = { [`${this.name}Id`]: profile.id || profile.sub }
    // When creating a new user extract required information from profile
    if (createEntity) {
      _.set(entity, 'username', _.get(profile, this.usernameFieldInProfile || 'username'))
      _.set(entity, 'name', _.get(profile, this.nameFieldInProfile || 'name'))
    }
    // Store provider profile information
    entity[`${this.name}`] = profile
    return entity
  }

  async getEntityQuery (profile,params) {
    console.log('Profile  :',profile)
    console.log('Entity  :',params)
    console.log('Name  :',this.name)
    return query = {
      $or: [
        { [`${this.name}Id`]: profile.id || profile.sub },
        { username: _.get(profile, this.usernameFieldInProfile || 'username' ) }
      ],
      $limit: 1
    }
  }
}