export const nagentsPath = 'api/v1/nagents'

export const nagentsMethods = ['find', 'get', 'create', 'patch', 'remove','subalterne']

export const nagentsClient = (client) => {
  const connection = client.get('connection')

  client.use(nagentsPath, connection.service(nagentsPath), {
    methods: nagentsMethods
  })

  /*client.use(nagentsPath+'/{agentId}/subalterne', connection.service(nagentsPath+'/{agentId}/subalterne'), {
    methods: nagentsMethods
  })*/
}
