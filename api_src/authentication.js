// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
import _ from 'lodash'

import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { LDAPStrategy } from './authenticate-ldap.js';
import { SSOStrategy } from './authenticate-sso.js';
import { oauth, OAuthStrategy} from '@feathersjs/authentication-oauth'
import { AuthenticationProviderStrategy } from './authenticationprovidersstrategy.js'

class MySSoService extends AuthenticationService {




  async getPayload(authResult, params) {
    console.log('Auth result :',authResult)
    // Call original `getPayload` first
    const payload = await super.getPayload(authResult, params);
    

    const { user } = authResult;



   console.log('Storage :', authResult);
   console.log('Params :', params);
   console.log('Auth  payload :', payload);

    if (user) {
      console.log('Auth test user :', user);
      params.user = user;
      payload.user = user;
    } else {
      console.log('Auth credential vide , payload :', payload);
    }

    return payload;
  }
}



export const authentication = (app) => {
  const config = app.get('authentication')
  //console.log('Auth config :',config)
  const authentication = new AuthenticationService(app)//MySSoService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())
  authentication.register('ldap', new LDAPStrategy());
  authentication.register('sso', new SSOStrategy());
  //authentication.register('auth0', new OAuthStrategy())

  // Store available OAuth providers
  app.authenticationProviders = _.keys(_.omit(config.oauth, ['redirect', 'origins']))

  console.log('Auth config providers :',app.authenticationProviders)
  for (const provider of app.authenticationProviders) {
    console.log('Provider :',provider)
    authentication.register(provider, new AuthenticationProviderStrategy())
  }

  app.use('authentication', authentication)
  //app.configure(expressOauth())
  app.configure(oauth({}))
}
