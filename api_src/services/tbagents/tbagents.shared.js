export const agentsPath = 'agents'

export const agentsMethods = ['find', 'get', 'create', 'patch', 'remove']

export const agentsClient = (client) => {
  const connection = client.get('connection')

  client.use(agentsPath, connection.service(agentsPath), {
    methods: agentsMethods
  })
}
