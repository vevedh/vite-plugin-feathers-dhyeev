export const checkdbPath = 'api/checkdb'

export const checkdbMethods = ['find', 'get', 'create', 'patch', 'remove']

export const checkdbClient = (client) => {
  const connection = client.get('connection')

  client.use(checkdbPath, connection.service(checkdbPath), {
    methods: checkdbMethods
  })
}
