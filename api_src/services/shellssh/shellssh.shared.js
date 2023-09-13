export const shellsshPath = 'api/v1/shellssh'

export const shellsshMethods = ['find', 'get', 'create', 'patch', 'remove']

export const shellsshClient = (client) => {
  const connection = client.get('connection')

  client.use(shellsshPath, connection.service(shellsshPath), {
    methods: shellsshMethods
  })
}
