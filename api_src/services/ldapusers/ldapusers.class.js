import { MongoDBService } from '@feathersjs/mongodb'
import { decodeSearchEntry } from '../../decodeSearchEntry.js';
import { NotFound, GeneralError, BadRequest } from '@feathersjs/errors'
// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class LdapusersService extends MongoDBService {

  constructor(options,app) {
    super(options,app)
 
  }

  async ldapSearch() {

    //console.log('ldapSearch :', this.options.app)
     const configuration = this.options.app.get('authentication').ldap
     const client = this.options.app.get('ldapClient')
 
     
 
     if (client.connected) {
       try {
         client.undind()
       } catch (error) {
         console.log('End search')
       }
 
     }
 
     if (!client.connected) {
       client.bind(configuration.bindDN, configuration.bindCredentials).then( () => {
       
           console.log('Connexion auth-sso ldap etablie avec succès!');
         
       }).catch((err) => {
         
           console.log('Echec auth-sso de connexion ldap !');
           return new GeneralError(new Error('Error in search ' + err))
       });
     }
 
     
 
    
 
     return new Promise((resolve, reject) => {
       console.log('Search...')
       if (!Date.fromLDAPString) {
         Date.fromLDAPString = function (s) {
           var b = s.match(/\d\d/g);
           return new Date(Date.UTC(b[0] + b[1], b[2] - 1, b[3], b[4], b[5], b[6]));
         }
       }
 
       let values = [];
       client.search(configuration.searchBase, {
           filter: '(&(samAccountType=805306368)(mail=*)(|(accountexpires=9223372036854775807)(accountexpires=*)))', //'(&(samAccountType=805306368)(!(userAccountControl:1.2.840.113556.1.4.803:=2))(mail=*)(|(accountexpires=9223372036854775807)(accountexpires=*)))', 
           scope: 'sub',
           sizeLimit: 3000,
           paged: false,
           attributes:['dn','mail','accountExpires','sn','givenName','title','physicalDeliveryOfficeName','telephoneNumber','objectClass','distinguishedName','memberOf','whenChanged','whenCreated','department','company','sAMAccountName','userAccountControl','manager','thumbnailPhoto'],
           explicitBufferAttributes: ['thumbnailPhoto']
         }).then( async (values) => {
         //console.log('entries: ', values.searchEntries);
         let value;
         if (values.searchEntries && values.searchEntries.length > 0) {
           value = decodeSearchEntry(values.searchEntries)
         } else {
           value = decodeSearchEntry(values.searchEntries[0])
         }
         // traitement spécial pour récupérer la photo de profil si elle existe
         
         //---------------------------------------------------------------------
         resolve(value)
         
       }).catch((err) => { 
         
           console.log('Error in search ' + err);
           reject(new GeneralError(new Error('Error in search ' + err)))
       })
 
     })
   }
 
  
 
   async initDB()  {
     const users = await this.ldapSearch()//await this.app.service('api/ldap-search').find({ query:'(|(uid=*)(sAMAccountName=*))' })
     //console.log('found users :', users.length)
     return new Promise((resolve, reject) => {
       this.options.app.get('mongodbClient').then(async (db) => {
         await db.collection('ldapusers').deleteMany({})
         await db.collection('ldapusers').insertMany([...users],{ ordered: true })
           
         const res = await db.collection('ldapusers').find({}).toArray()
         
         resolve(res.length)
       }).catch((err) => {
         reject(new GeneralError(new Error('Error in search ' + err)))
       })
     })
     
   }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    multi: true,
    Model: app.get('mongodbClient').then((db) => db.collection('ldapusers')),
    app: app
  }
}
