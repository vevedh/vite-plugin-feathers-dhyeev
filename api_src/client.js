// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import { ldapusersClient } from './services/ldapusers/ldapusers.shared.js'

import { agentsClient } from './services/agents/agents.shared.js'

import { nagentsClient } from './services/nagents/nagents.shared.js'

import { shellsshClient } from './services/shellssh/shellssh.shared.js'

//import { testClient } from './services/test/test.shared.js'

import { messagesClient } from './services/messages/messages.shared.js'

import { dbagentsClient } from './services/dbagents/dbagents.shared.js'

//import { agentsClient } from './services/agents/agents.shared.js'

import { ldapSearchClient } from './services/ldap-search/ldap-search.shared.js'

import { confInfosClient } from './services/conf-infos/conf-infos.shared.js'

import { checkdbClient } from './services/checkdb/checkdb.shared.js'

import { jsonusersClient } from './services/jsonusers/jsonusers.shared.js'

import { usersClient } from './services/users/users.shared.js'

/**
 * Returns a  client for the bke-dsi-cacem app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = (connection, authenticationOptions = {}) => {
  const client = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(usersClient)

  client.configure(jsonusersClient)

  client.configure(checkdbClient)

  client.configure(confInfosClient)

  client.configure(ldapSearchClient)

  //client.configure(agentsClient)

  client.configure(dbagentsClient)

  client.configure(messagesClient)

  //client.configure(testClient)

  client.configure(shellsshClient)

  client.configure(nagentsClient)

  client.configure(agentsClient)

  client.configure(ldapusersClient)

  return client
}
