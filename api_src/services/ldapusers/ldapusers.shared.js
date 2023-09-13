export const ldapusersPath = 'api/v1/ldapusers'

export const ldapusersMethods = ['find', 'get', 'create', 'patch', 'remove','initDB']

export const ldapusersClient = (client) => {
  const connection = client.get('connection')

  client.use(ldapusersPath, connection.service(ldapusersPath), {
    methods: ldapusersMethods
  })
}
