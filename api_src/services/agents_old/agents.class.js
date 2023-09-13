// This is a skeleton for a custom service class. Remove or add the methods you need here
import { MongoDBService } from '@feathersjs/mongodb'
import { decodeSearchEntry } from '../../decodeSearchEntry.js';
import { NotFound, GeneralError, BadRequest } from '@feathersjs/errors'

export class AgentsService  extends MongoDBService {
  constructor(options,app) {
    super(options,app)
 
  }

  async get(id,_params) {
    console.log('get',id,_params)
    if (Object.entries(_params.query).length!=0) {
      if (Object(this.getOptions('paginate')).hasOwnProperty('paginate')) {
        const getinfos = await this._find(_params)
        //console.log('get infos',getinfos)
        const newdata = getinfos.data.map((o) => { 
          return {_id: o._id, samacount: o.sAMAccountName, email: o.mail, nom: o.sn, prenom: o.givenName, sexe: '', telephone: [o.telephoneNumber,o.mobile], actif: true, affectation: {fonction:o.title, service: o.department, dateExpiration: ''},localisation: {bureau:o.physicalDeliveryOfficeName,site: o.company}} 
        })
        //console.log('get data',newdata)
        return { ...getinfos, data: newdata}
        //  return { total:getinfos.total,limit:getinfos.limit,skip:getinfos.skip, data: newdata}
       
      } else {
        
        return (await this._find(_params)).map((o) => { 
          return {_id: o._id, samacount: o.sAMAccountName, email: o.mail, nom: o.sn, prenom: o.givenName, sexe: '', telephone: [o.telephoneNumber,o.mobile], actif: true, affectation: {fonction:o.title, service: o.department, dateExpiration: ''},localisation: {bureau:o.physicalDeliveryOfficeName,site: o.company}} 
        })
        /*const res = (await this._find(_params))
        return {_id: res._id, samacount: res.sAMAccountName, email: res.mail, nom: res.sn, prenom: res.givenName, sexe: '', telephone: [res.telephoneNumber,res.mobile], actif: res.enabled, affectation: {fonction:res.title, service: res.department, dateExpiration: res.accountExpires},localisation: {bureau:res.physicalDeliveryOfficeName,site: res.company}}
        */
      }
      
    } else {
      if (Object(this.getOptions('paginate')).hasOwnProperty('paginate')) {
        const newdata = (await this._get(id,_params)).data.map((o) => { 
          return {_id: o._id, samacount: o.sAMAccountName, email: o.mail, nom: o.sn, prenom: o.givenName, sexe: '', telephone: [o.telephoneNumber,o.mobile], actif: true, affectation: {fonction:o.title, service: o.department, dateExpiration: ''},localisation: {bureau:o.physicalDeliveryOfficeName,site: o.company}} 
        })
        const getinfos = (await this._get(id,_params))
        return { ...getinfos, data: newdata}
        
      } else {
        /*return (await this._get(id,_params)).map((o) => { 
          return {_id: o._id, samacount: o.sAMAccountName, email: o.mail, nom: o.sn, prenom: o.givenName, sexe: '', telephone: [o.telephoneNumber,o.mobile], actif: true, affectation: {fonction:o.title, service: o.department, dateExpiration: ''},localisation: {bureau:o.physicalDeliveryOfficeName,site: o.company}} 
        })*/
        const res = (await this._get(id,_params))
        return {_id: res._id, samacount: res.sAMAccountName, email: res.mail, nom: res.sn, prenom: res.givenName, sexe: '', telephone: [res.telephoneNumber,res.mobile], actif: res.enabled, affectation: {fonction:res.title, service: res.department, dateExpiration: res.accountExpires},localisation: {bureau:res.physicalDeliveryOfficeName,site: res.company}} 
      }
      
    }

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
        
        /*
        const binaryThumb = await client.search(configuration.searchBase,{ filter: filter,attributes:['thumbnailPhoto;binary']})
        console.log('Ldap TUMBNAIL  :',Buffer.from(binaryThumb.searchEntries[0]['thumbnailPhoto;binary'],'binary').toString('base64'));
        if (binaryThumb.searchEntries.length == 1) {
          value.img64 = Buffer.from(binaryThumb.searchEntries[0]['thumbnailPhoto;binary'],'binary').toString('base64')
        }
        */
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
        await db.collection('agents').deleteMany({})
        await db.collection('agents').insertMany([...users],{ ordered: true })
          
        const res = await db.collection('agents').find({}).toArray()
        
        resolve(res.length)
      }).catch((err) => {
        reject(new GeneralError(new Error('Error in search ' + err)))
      })
    })
    
  }

  async getAgentId(data,_params) {
    console.log('Get data: ' , data)
    console.log('Get params: ', _params)
  }
}

export class AgentsSubalternesService  extends MongoDBService {
  constructor(options,app) {
    super(options,app)
 
  }

  async find(_params) {
    console.log('get',_params)
    if ( Object(_params.route).hasOwnProperty('agentId')) {
      
      
      if (String(_params.route.agentId).match(/\w*@\w*/) != null) {

        if (Object(this.getOptions('paginate')).hasOwnProperty('paginate')) {
          const dn = (await this._find({query: { email: _params.route.agentId}})).data[0].distinguishedName
          const getinfos = (await this._find({query: { manager: dn }}))
          const newdata = (await this._find({query: { manager: dn }})).data.map((o) => {
            return { _id: o._id, samacount: o.sAMAccountName, email: o.mail, nom: o.sn, prenom: o.givenName, sexe: '', telephone: [o.telephoneNumber,o.mobile], actif: o.enabled, affectation: {fonction:o.title, service: o.department, dateExpiration: o.accountExpires},localisation: {bureau:o.physicalDeliveryOfficeName,site: o.company}}
          })
          return { ...getinfos, data: newdata}

        } else {
          const dn = (await this._find({query: { mail: _params.route.agentId}}))[0].distinguishedName
          return (await this._find({query: { manager: dn }})).map((o) => {
            return { _id: o._id, samacount: o.sAMAccountName, email: o.mail, nom: o.sn, prenom: o.givenName, sexe: '', telephone: [o.telephoneNumber,o.mobile], actif: o.enabled, affectation: {fonction:o.title, service: o.department, dateExpiration: o.accountExpires},localisation: {bureau:o.physicalDeliveryOfficeName,site: o.company}}
          })
        }
        


      } else {

        if (Object(this.getOptions('paginate')).hasOwnProperty('paginate')) {
          const dn = (await this._find({query: { sAMAccountName: _params.route.agentId}})).data[0].distinguishedName
          const getinfos = (await this._find({query: { manager: dn }}))
          const newdata = (await this._find({query: { manager: dn }})).data.map((o) => { 
            return {_id: o._id, samacount: o.sAMAccountName, email: o.mail, nom: o.sn, prenom: o.givenName, sexe: '', telephone: [o.telephoneNumber,o.mobile], actif: o.enabled, affectation: {fonction:o.title, service: o.department, dateExpiration: o.accountExpires},localisation: {bureau:o.physicalDeliveryOfficeName,site: o.company}} 
          })
          return { ...getinfos, data: newdata}

        } else {
          console.log('Paginate Options :',this.getOptions('paginate'))
          const dn = (await this._find({query: { sAMAccountName: _params.route.agentId}}))[0].distinguishedName
          return (await this._find({query: { manager: dn }})).map((o) => { 
            return {_id: o._id, samacount: o.sAMAccountName, email: o.mail, nom: o.sn, prenom: o.givenName, sexe: '', telephone: [o.telephoneNumber,o.mobile], actif: o.enabled, affectation: {fonction:o.title, service: o.department, dateExpiration: o.accountExpires},localisation: {bureau:o.physicalDeliveryOfficeName,site: o.company}} 
          })
        }
        
        
        
      }
      
    }
    return []
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
          filter: '(&(samAccountType=805306368)(mail=*)(|(accountexpires=9223372036854775807)(accountexpires=0)))', // (!(userAccountControl:1.2.840.113556.1.4.803:=*))
          scope: 'sub',
          sizeLimit: 3000,
          paged: false,
          attributes:['dn','mail','accountExpires','sn','givenName','title','physicalDeliveryOfficeName','telephoneNumber','objectClass','distinguishedName','memberOf','whenChanged','whenCreated','department','company','sAMAccountName','userAccountControl','thumbnailPhoto','manager'],
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
        
        /*
        const binaryThumb = await client.search(configuration.searchBase,{ filter: filter,attributes:['thumbnailPhoto;binary']})
        console.log('Ldap TUMBNAIL  :',Buffer.from(binaryThumb.searchEntries[0]['thumbnailPhoto;binary'],'binary').toString('base64'));
        if (binaryThumb.searchEntries.length == 1) {
          value.img64 = Buffer.from(binaryThumb.searchEntries[0]['thumbnailPhoto;binary'],'binary').toString('base64')
        }
        */
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
        await db.collection('agents').deleteMany({})
        await db.collection('agents').insertMany([...users],{ ordered: true })
          
        const res = await db.collection('agents').find({}).toArray()
        
        resolve(res.length)
      }).catch((err) => {
        reject(new GeneralError(new Error('Error in search ' + err)))
      })
    })
    
  }

  async getAgentId(data,_params) {
    console.log('Get data: ' , data)
    console.log('Get params: ', _params)
  }
}

export class AgentsResponsableService  extends MongoDBService {
  constructor(options,app) {
    super(options,app)
 
  }

  async find(_params) {
    console.log('get',_params)
    if ( Object(_params.route).hasOwnProperty('agentId')) {
       
      if (String(_params.route.agentId).match(/\w*@\w*/) != null) {

        if (Object(this.getOptions('paginate')).hasOwnProperty('paginate')) {
          const dn = (await this._find({query: { email: _params.route.agentId}})).data[0].manager
          const getinfos = (await this._find({query: { distinguishedName: dn }}))
          const newdata = (await this._find({query: { distinguishedName: dn }})).data.map((o) => {
            return { _id: o._id, samacount: o.sAMAccountName, email: o.mail, nom: o.sn, prenom: o.givenName, sexe: '', telephone: [o.telephoneNumber,o.mobile], actif: o.enabled, affectation: {fonction:o.title, service: o.department, dateExpiration: o.accountExpires},localisation: {bureau:o.physicalDeliveryOfficeName,site: o.company}}
          })
          return { ...getinfos, data: newdata}

        } else {
          const dn = (await this._find({query: { mail: _params.route.agentId}}))[0].manager
          return (await this._find({query: { distinguishedName: dn }})).map((o) => {
            return { _id: o._id, samacount: o.sAMAccountName, email: o.mail, nom: o.sn, prenom: o.givenName, sexe: '', telephone: [o.telephoneNumber,o.mobile], actif: o.enabled, affectation: {fonction:o.title, service: o.department, dateExpiration: o.accountExpires},localisation: {bureau:o.physicalDeliveryOfficeName,site: o.company}}
          })
        }
        


      } else {

        if (Object(this.getOptions('paginate')).hasOwnProperty('paginate')) {
          const dn = (await this._find({query: { sAMAccountName: _params.route.agentId}})).data[0].manager
          const getinfos = (await this._find({query: { distinguishedName: dn }}))
          const newdata = (await this._find({query: { distinguishedName: dn }})).data.map((o) => { 
            return {_id: o._id, samacount: o.sAMAccountName, email: o.mail, nom: o.sn, prenom: o.givenName, sexe: '', telephone: [o.telephoneNumber,o.mobile], actif: o.enabled, affectation: {fonction:o.title, service: o.department, dateExpiration: o.accountExpires},localisation: {bureau:o.physicalDeliveryOfficeName,site: o.company}} 
          })
          return { ...getinfos, data: newdata}

        } else {
          console.log('Paginate Options :',this.getOptions('paginate'))
          const dn = (await this._find({query: { sAMAccountName: _params.route.agentId}}))[0].manager
          return (await this._find({query: { distinguishedName: dn }})).map((o) => { 
            return {_id: o._id, samacount: o.sAMAccountName, email: o.mail, nom: o.sn, prenom: o.givenName, sexe: '', telephone: [o.telephoneNumber,o.mobile], actif: o.enabled, affectation: {fonction:o.title, service: o.department, dateExpiration: o.accountExpires},localisation: {bureau:o.physicalDeliveryOfficeName,site: o.company}} 
          })
        }
        
        
        
      }
      
    }
    return []
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
          filter: '(&(samAccountType=805306368)(mail=*)(|(accountexpires=9223372036854775807)(accountexpires=0)))', // (!(userAccountControl:1.2.840.113556.1.4.803:=*))
          scope: 'sub',
          sizeLimit: 3000,
          paged: false,
          attributes:['dn','mail','accountExpires','sn','givenName','title','physicalDeliveryOfficeName','telephoneNumber','objectClass','distinguishedName','memberOf','whenChanged','whenCreated','department','company','sAMAccountName','userAccountControl','thumbnailPhoto','manager'],
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
        
        /*
        const binaryThumb = await client.search(configuration.searchBase,{ filter: filter,attributes:['thumbnailPhoto;binary']})
        console.log('Ldap TUMBNAIL  :',Buffer.from(binaryThumb.searchEntries[0]['thumbnailPhoto;binary'],'binary').toString('base64'));
        if (binaryThumb.searchEntries.length == 1) {
          value.img64 = Buffer.from(binaryThumb.searchEntries[0]['thumbnailPhoto;binary'],'binary').toString('base64')
        }
        */
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
        await db.collection('agents').deleteMany({})
        await db.collection('agents').insertMany([...users],{ ordered: true })
          
        const res = await db.collection('agents').find({}).toArray()
        
        resolve(res.length)
      }).catch((err) => {
        reject(new GeneralError(new Error('Error in search ' + err)))
      })
    })
    
  }

  async getAgentId(data,_params) {
    console.log('Get data: ' , data)
    console.log('Get params: ', _params)
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),//app.get('paginate'),
    multi:true,
    Model: app.get('mongodbClient').then((db) => db.collection('agents')),
    app: app
  }
}
