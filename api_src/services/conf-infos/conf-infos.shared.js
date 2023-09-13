export const confInfosPath = 'api/conf-infos'

export const confInfosMethods = ['find', 'get', 'create', 'patch', 'remove']

export const confInfosClient = (client) => {
  const connection = client.get('connection')

  client.use(confInfosPath, connection.service(confInfosPath), {
    methods: confInfosMethods
  })
}
