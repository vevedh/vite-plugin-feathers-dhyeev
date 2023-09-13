export const agentsPath = 'api/v1/agents'

export const agentsMethods = ['find', 'get', 'create', 'patch', 'remove', 'initDB']

export const agentsClient = (client) => {
  const connection = client.get('connection')

  client.use(agentsPath, connection.service(agentsPath), {
    methods: agentsMethods
  })

  client.use(agentsPath+'/:agentId', connection.service(agentsPath+'/:agentId'), {
    methods: agentsMethods//['getAgentid']
  })

  client.use(agentsPath+'/:agentId/subalternes', connection.service(agentsPath+'/:agentId/subalternes'), {
    methods: agentsMethods//['getAgentid']
  })

  client.use(agentsPath+'/:agentId/responsable', connection.service(agentsPath+'/:agentId/responsable'), {
    methods: agentsMethods//['getAgentid']
  })
}
