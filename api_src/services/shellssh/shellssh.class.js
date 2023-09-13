
import  {NodeSSH} from 'node-ssh';
const ssh = new NodeSSH()

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class ShellsshService {

  

  constructor(options,app) {
    this.options = options || {}
    this.app = app || {}
  }

  
  async find(_params) {
    return []
  }
  

  async get(id, _params) {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }
  async create(data, params) {
    return new Promise((resolve,reject)=>{

      if (data) {
        ssh.connect(data.connexion).then(async () => {
          result = await ssh.execCommand(data.cmd, data.cwd)
          resolve(result)
        })

      } else {
        reject({
          id: 0,
          ...data
        })
      }

    })

    
  }

  // This method has to be added to the 'methods' option to make it available to clients
  
  async update(id, data, _params) {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id, data, _params) {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id, _params) {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app) => {
  return { app }
}
