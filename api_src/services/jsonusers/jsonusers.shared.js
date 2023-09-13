export const jsonusersPath = 'jsonusers'

export const jsonusersMethods = ['find', 'get', 'create', 'patch', 'remove']

export const jsonusersClient = (client) => {
  const connection = client.get('connection')

  client.use(jsonusersPath, connection.service(jsonusersPath), {
    methods: jsonusersMethods
  })
}
