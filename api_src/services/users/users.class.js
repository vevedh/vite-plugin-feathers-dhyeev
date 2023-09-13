
import { MongoDBService } from '@feathersjs/mongodb'

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class UsersService extends MongoDBService {}

export const getOptions = (app) => {
  return {
    
    paginate: false, //app.get('paginate'),//,
    multi:true,
    Model: app.get('mongodbClient').then((db) => db.collection('users'))
  }
}
