import { logger } from '../../logger.js'
import  { MongoClient }  from 'mongodb'
import { NotFound, GeneralError, BadRequest } from '@feathersjs/errors'
import { MongoDBService } from '@feathersjs/mongodb'
import dbMgmt from 'feathers-mongodb-management';
// This is a skeleton for a custom service class. Remove or add the methods you need here
export class CheckdbService {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }


  async getCollections(name) {
    const client = (await this.app.get('mongodbClient')).client;
    //return new Promise(async (resolve, reject) => {
      let res = null
      logger.info('Client db : %j',(await client.db(name)))
     //MongoClient.connect('mongodb://admcacem:Cacem972@localhost:27019/').then( (clt) => {
        /*clt.db(name).listCollections().toArray().then((cols) => {
          //jsonRes.push({...dbElt,tables:cols})
          logger.info('collections : %j', cols)
          resolve(cols)
        }).catch((err) => {
          reject(false)
        })*/
        //res = []
       // logger.info('client : %j', clt.db(name))
      //})*/
      //return res
    //})
  }

  async find(_params) {
    return new Promise(async (resolve, reject) => {
      if (_params && _params.query.database === 'database') {
        logger.info('checkdb:Mongo database : %s',this.app.get('currentDatabase'));
        resolve(this.app.get('currentDatabase'));
      } else if (_params && _params.query.database === 'databases') {
      //logger.info('checkdb:Mongo databases : %j',this.app.get('alldatabases'));
      //return this.app.get('alldatabases');
      const connection = this.app.get('mongodb')
      const database = new URL(connection).pathname.substring(1)
      logger.info('Base de donnée : ' + database);
      logger.info('Base url de connexion : ' + connection);
      const client = (await this.app.get('mongodbClient')).client;////await MongoClient.connect(connection)
      console.log('Client :',client)
      
      const db = await client.db().admin();//.admin();
      logger.info('Bases de données : %j' , (await db.listDatabases()));
      const databases = Object.assign([],(await db.listDatabases()).databases)
      logger.info('Bases de données : %j' , databases);

          let dbi
          let jsonRes = []
          databases.forEach( (dbElt) => {
            jsonRes.push({...dbElt, tables:null})
          })
          logger.info('JSON : %j', jsonRes)
          let i =0
          for (let index = 0; index < jsonRes.length; index++) {
            const element = jsonRes[index];
            const dbi = await client.db(element.name)
            const cols = (await dbi.listCollections().toArray())
            logger.info('collections : %j', cols)
            jsonRes[index].tables = cols
            
          }
        logger.info('JSON : %j', jsonRes)
          //client2.close()
        resolve(jsonRes)
        
        

      
    } else {
      resolve(new BadRequest('Erreur dans la requête'))
    }
    
  })
    //
  }

  async get(id, _params) {
    return new Promise((resolve, reject) => {
      resolve({
        id: 0,
        text: `A new message with ID: ${id}!`
      })
    })
  }
  async create(data, _params) {
    return new Promise((resolve, reject) => {
      if (_params && _params.query?.createdb && _params.query?.collection) {
        const connection = this.app.get('mongodb')
        const database = new URL(connection).pathname.substring(1)
        logger.info('Base de donnée : ' + database);
        logger.info('Base url de connexion : ' + this.app.get('mongodb'));
        MongoClient.connect(this.app.get('mongodb')).then( async (client) => {
          try {
            const newDb = client.db(_params.query.createdb);
            await newDb.createCollection(_params.query.collection)
            client.close();
            resolve({
              database: _params.query.createdb,
              collection: _params.query.collection,
              created: true
            })
          } catch (error) {
            resolve(new BadRequest('Erreur dans la requête'))
          }
          

        })
      } else {
        resolve(new BadRequest('Erreur dans la requête'))
      }
    })
    /*if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, _params)))
    }

    return {
      id: 0,
      ...data
    }*/
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
