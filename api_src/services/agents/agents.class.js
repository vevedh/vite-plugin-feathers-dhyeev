import { MongoDBService } from '@feathersjs/mongodb'
import { decodeSearchEntry } from '../../decodeSearchEntry.js';
import { agentsPath, agentsMethods } from './agents.shared.js'
import { NotFound, GeneralError, BadRequest } from '@feathersjs/errors'
// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class AgentsService extends MongoDBService {
  constructor(options,app) {
    super(options,app)
    this.app = app
  }

  async find(_params) {
    
    console.log('Find params: ' , _params);
    
    return super.find(_params)
  }

  async get(id,_params) {
    console.log('Get params: ' , _params);
    console.log('Get Id: ' ,id);
    if (String(id).match(/\w*\d{1,}\w*/) == null) {
      // si Id ne contient pas de chiffre
      if (String(id).match(/\w*@\w*/) != null) {
        // si Id ne contient un arobase
        _params.query = { email: id }
        return super.find(_params)
      } else {
        _params.query = { samacount: id }
        return super.find(_params)
      }
     
    }
    //return super.get(id,_params)
    _params.query = { _id: id }
    return super.find(_params)
   
    
    
  }

  async ldapSearch() {

    console.log('ldapSearch :', this.options.app)
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
         //console.log('Valeur réelle :',value)
         if (Array.isArray(value)) {
            const result = value.map( (o) => { 
              return { samacount: o.sAMAccountName, email: o.mail, nom: o.sn, prenom: o.givenName, avatar:o.img64, sexe: '', telephone: [o.telephoneNumber,o.mobile], actif: o.enabled, affectation: {fonction:o.title, service: o.department, dateExpiration: o.accountExpires},localisation: {bureau:o.physicalDeliveryOfficeName,site: o.company}} 
            })
            resolve(result)
          } else {
            const result = { samacount: value.sAMAccountName, email: value.mail, nom: value.sn, prenom: value.givenName, avatar:o.img64, sexe: '', telephone: [value.telephoneNumber,value.mobile], actif: value.enabled, affectation: {fonction:value.title, service: value.department, dateExpiration: value.accountExpires},localisation: {bureau:value.physicalDeliveryOfficeName,site: value.company}} 
            resolve(result)
          }
         
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
         await db.collection('agents').deleteMany({})
         await db.collection('agents').insertMany([...users],{ ordered: true })
           
         const res = await db.collection('agents').find({}).toArray()
         
         resolve(res.length)
       }).catch((err) => {
         reject(new GeneralError(new Error('Error in search ' + err)))
       })
     })
     
   }
 
   getAgentId(data,_params) {
     console.log('Get data: ' , data)
     console.log('Get params: ', _params)
   }

}


export const getOptions = (app) => {
  return {
    
    paginate: app.get('paginate'),
    multi: true,
    Model: app.get('mongodbClient').then((db) => db.collection('agents')),
    app: app
  }
}


