import { ldapusers } from './ldapusers/ldapusers.js'

import { agents } from './agents/agents.js'

//import { nagents } from './nagents/nagents.js'

import { shellssh } from './shellssh/shellssh.js'

import { messages } from './messages/messages.js'

//import { dbagents } from './dbagents/dbagents.js'

import { ldapSearch } from './ldap-search/ldap-search.js'

import { confInfos } from './conf-infos/conf-infos.js'

import { checkdb } from './checkdb/checkdb.js'

//import { jsonusers } from './jsonusers/jsonusers.js'

import { users } from './users/users.js'

//import { user } from './users_valid/users.js'

export const services = (app) => {
  
  app.configure(agents)

  app.configure(shellssh)

  app.configure(messages)

  //app.configure(dbagents)

  app.configure(ldapSearch)

  app.configure(confInfos)

  app.configure(checkdb)

  //app.configure(jsonusers)
app.configure(ldapusers)

  app.configure(users)
  //app.configure(agents)
  //app.configure(user)
  // All services will be registered here
}
