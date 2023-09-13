// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import  { MongoClient }  from 'mongodb'

import { MongoDBService } from '@feathersjs/mongodb'
//import dbMgmt from 'feathers-mongodb-management';
import { logger } from './logger.js'
export const mongodb = (app) => {
  const connection = app.get('mongodb')

  
  const database = new URL(connection).pathname.substring(1)
  logger.info('Base de donnée : ' + database);
  
  logger.info('Base url de connexion : ' + app.get('mongodb'));
  const mongoClient = MongoClient.connect(app.get('mongodb')).then( (client) => {

    const dbAdmin = client.db().admin();
    //app.use('/mongo/databases', dbMgmt.database({ adminDb: dbAdmin, client }));
    
    let collections
    dbAdmin.listDatabases().then((result) => {
      logger.info('Databases : %j',result);
      console.log('Services :',Object.keys(app.services))
      if (Array.isArray(result.databases)) {
        console.log('Databases Taille :',result.databases.length)
        //result.databases.forEach((database) => {
        if ( Array.isArray(result.databases) ) {
          for (let index = 0; index < result.databases.length; index++) {
            const database = result.databases[index];
            const db = client.db(database.name);
            
            //app.use('/mongo/'+database.name+'/collections', dbMgmt.collection({ db }));
            /*app.service('/mongo/'+database.name+'/collections').find({}).then((collections) => {
              console.log('BASE  :',database.name)
              
              if (Array.isArray(collections)) {
                console.log('Taille :',collections.length)
                console.log('Creation du service : ',collections)
                //collections.forEach((collection) => {
                for (let idc = 0; idc < collections.length; idc++) {
                  const collection = collections[idc];
                  
                  //if (collection?.name) {
                    const cname = collection?.name
                  //} 
                  console.log('Db:' +database?.name +'Db mgmt :',cname);
                    
                    if (!(Object.keys(app.services).includes('mongo/'+database.name+'/'+cname))) {
                      
                      console.log('Creation du service : ','/mongo/'+database.name+'/'+cname)
                      app.use('/mongo/'+database.name+'/'+cname, new MongoDBService({
          
                        paginate: false, //app.get('paginate'),//,
                        multi:true,
                        Model: app.get('mongodbClient').then((db) => db.collection(cname))
                      }),{
                        methods:  ['find', 'get', 'create', 'patch', 'remove']
                      })
                    }
                  
                }//)
              }
            });*/
            
            //app.use('/mongo/'+database.name+'/users', dbMgmt.user({ db }));
            
          }
        }
        
      }
      
      app.set('alldatabases', result.databases);
    });

    
    app.set('currentDatabase', database);
    logger.info('currentDatabase : %s',app.get('currentDatabase'));
    app.set('mongodb_ok', true);
    logger.info('mongodb_ok : %s', app.get('mongodb_ok'));
    logger.info('Votre base de donnée Mongodb accessible configurée!');

    return client.db(database);

  })
  .catch((err) => {
    app.set('mongodb_ok', false);
    logger.info(
      `Votre base de donnée Mongodb n\'est pas accessible ou est non configurée!\n
      Mongo url : ${connection}`
    );
    logger.info(`Dans le fichier de configuration vous devez avoir une chaine de connexion accessible!\n
    Exemple de configuration:

      "mongodb": "mongodb://localhost:27017/database?authSource=admin"\n `);
  })

  app.set('mongodbClient', mongoClient)
}
