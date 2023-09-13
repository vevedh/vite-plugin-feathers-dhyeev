export const ldapSearchPath = 'api/ldap-search'

export const ldapSearchMethods = ['find', 'get', 'create', 'patch', 'remove']

export const ldapSearchClient = (client) => {
  const connection = client.get('connection')

  client.use(ldapSearchPath, connection.service(ldapSearchPath), {
    methods: ldapSearchMethods
  })
}
