export const dbagentsPath = 'api/dbagents'

export const dbagentsMethods = ['find', 'get', 'create', 'patch', 'remove','init']

export const dbagentsClient = (client) => {
  const connection = client.get('connection')

  client.use(dbagentsPath, connection.service(dbagentsPath), {
    methods: dbagentsMethods
  })
}
