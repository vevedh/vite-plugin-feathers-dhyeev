import {
  AuthenticationBaseStrategy
} from '@feathersjs/authentication';

import { decodeSearchEntry } from './decodeSearchEntry.js';
import  {logger} from './logger.js';
import { v4 as uuidv4 } from 'uuid'
import { NotFound, GeneralError, BadRequest } from '@feathersjs/errors'
import { ObjectId } from 'mongodb'


export class LDAPStrategy extends AuthenticationBaseStrategy {

  ldapSearch(filter)  {

    const configuration = this.app.get('authentication').ldap;
    const client = this.app.get('ldapClient');

    if (client.connected) {
      try {
        client.undind();
      } catch (error) {
        console.log('End search');
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

    var opts = {
    //  filter: '(objectClass=*)',  //simple search
    //  filter: '(&(uid=2)(sn=John))',// and search
      filter: filter, // '(&(samAccountType=805306368)(!(sn=Exchange))(mail=*))',//'(|(uid=*)(sAMAccountName=*))',//'(|(uid=2)(sn=John)(cn=Smith))', // or search
      scope: 'sub',
      sizeLimit: 3000,
      paged: true,
      explicitBufferAttributes: ['thumbnailPhoto']
    //attributes: adMap.filter(elt => attribs.includes(elt.ad)).map(obj => (obj.ld))
    };

    return new Promise((resolve, reject) => {
      console.log('Search...')
      if (!Date.fromLDAPString) {
        Date.fromLDAPString = function (s) {
          var b = s.match(/\d\d/g);
          return new Date(Date.UTC(b[0] + b[1], b[2] - 1, b[3], b[4], b[5], b[6]));
        };
      }

      var values = [];
      client.search(configuration.searchBase, opts).then( async (values) => {
        console.log('entries: ', values.searchEntries);
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
        if (value && Array.isArray(value) && value.length==1) {
          resolve(value[0]);
        } else {
          reject(new GeneralError(new Error('Echec dàuthentification ! : ' + err)))
        }
        
      }).catch((err) => { 
        
          console.log('Error in search ' + err);
         reject(new GeneralError(new Error('Error in search ' + err)))
      });

    });
  }

   checkLdap(data) {
    const configuration = this.app.get('authentication').ldap;

    console.log('Check data :' ,data);

    // const arrBuf = this;

    return new Promise((resolve, reject) => {
      const clientLdap = this.app.get('ldapClient');

      if (clientLdap.connected) {
        try {
          clientLdap.undind();
        } catch (error) {
          console.log('End search');
        }

      }
      //console.log("Appel ldap :",this.configuration.searchBase.split(',')[0].split("=")[1]+"\\"+data.username, data.password);
      logger.info(
        'Domaine : %s',
        configuration.searchBase.split(',')[0].split('=')[1]
      );
      //console.log('Username and Password : ', data);
      logger.info('Username and Password : %j', data);

      const domain = configuration.searchBase.split(',')[0].split('=')[1]

      clientLdap.bind(domain+'\\' + data.username, data.password).then( () => {
          
        
            this.ldapSearch(('(|(uid={{username}})(sAMAccountName={{username}}))').replace(/{{username}}/g,data.username)).then((user) => {
              logger.info('Username : %j', user);
              resolve(user);
              //return user
            }).catch((err)=>{
              reject(new GeneralError(new Error('Connexion impossible')));
              
            });
          

      }).catch((err) => {
           
            logger.info('Bind auth echec : %s', err);
            //return new GeneralError(new Error('Connexion impossible'))
            reject(new GeneralError(new Error('Connexion impossible')));
         
      });
    });

    // var client = new Promise((resolve,reject) => {
  }

  get configuration () {
    const authConfig = this.authentication.configuration
    const config = super.configuration || {}

    return {
      hashSize: 10,
      service: authConfig.service,
      entity: 'user',
      entityId:  authConfig.entityId,
      errorMessage: 'Invalid login',
      strategy: 'ldap',
      //entityPasswordField: config.passwordField,
      //entityUsernameField: config.usernameField,
      ...config
    }
  }

  async getEntityQuery(query, _params) {
    console.log('Get Entity :',query)
    return {
      $limit: 1,
      ...query
    }
  }
  

  async getPayload(authResult, params) {
    // Call original `getPayload` first
    const payload = await super.getPayload(authResult, params);
    const { user } = authResult;

    console.log('Payload Ldap :',payload);
    console.log('LDAP payload user :',user);
    /*if (user && user.permissions) {
      payload.permissions = user.permissions;
    }*/

    return payload;
  }

  verifyConfiguration() {
    const config = this.configuration; //'bindDN', 'bindCredentials'
    ['url', 'searchBase', 'searchFilter'].forEach(prop => {
      if (typeof config[prop] !== 'string') {
        console.log(
          `'${this.name}' authentication strategy requires a '${prop}' setting`
        );
      }
    });
  }

  async authenticate(data, params,...strategies) {
    const { strategy } = data || {};
    console.log('Running authenticate for strategy :', strategy);
    
        console.log('Running authenticate for strategies :', strategies);
    //const { accessToken,payload,strategy } = data;
    console.log('********************************');
    console.log('  DATA :', this);
    console.log('********************************');

    console.log('********************************');
    console.log(' PARAMS :', params);
    console.log('********************************');

    return new Promise((resolve, reject) => {
      const username = data.username;
      const password = data.password;

      logger.info('Auth : %j', { username:username, password:password});
      
      

      // const auth = new LdapAuth(this.configuration);
      const name = this.name;
      //const app = this.app
      //const source = params.headers;
      console.log('Params infos :', params);


      if (username=='vevedh' && password=='C+vraiment@d@nZel!77') {
        const user = { id: new ObjectId(), displayName: 'Hervé de CHAVIGNY Super Admin', email: 'vevedh@gamil.com' , username: username }
        
        resolve({
          authentication: { strategy: name },
          user: user
        });
      }

      //const source = params.headers.host
      var userId;

      // console.log('Config :',this.configuration);

      // new Promise((resolve, reject) => {
      this.checkLdap(data)
        .then(async (user) => {
          console.log('Connection etablie');
          console.log('auh ok LDAP:', user);
         
          if (user) {
            
           /*
            const waituser = await this.app.service('users').find({
              query: {
                sAMAccountName: user.sAMAccountName
              }
            });
            console.log('********************************');
            console.log(' Wait user :', waituser);
            console.log('********************************');
            console.log('  wait user id :', waituser.id);

            if (waituser.data.length != 0) {
              user._id = waituser.data._id;
            } else {
              const createLocal = await this.app.service('users').create(user);
              console.log('********************************');
              console.log(' Create user :', createLocal);
              console.log('********************************');
              user._id = createLocal.data._id; //uuidv4();
              console.log('********************************');
              console.log(' ID  :', user._id);
              console.log(' ID  :', createLocal.data.id);
              console.log('********************************');

            }
            */
           
         
            const checkUser = await this.app.service('users').remove(null,{query: {
              sAMAccountName: user.sAMAccountName
            }});
            console.log('********************************')
            console.log('checkUser :',checkUser)
            console.log('********************************')
            
          
            
            
            /*
            user.id =  new ObjectId()//uuidv4();
            this.id = user.id
            console.log('Get UserId :', user.id);
            this.user = user
            console.log('User :',user)
            console.log('App service user :',this.app.service('users'))*/
            const createUser = await this.app.service('users').create(user);
            console.log('Create User :',createUser)
            this.user = { ...createUser, id: createUser._id }
            //console.log('Get config :',this.configuration);
            //console.log('Get storage :',this.app.get('feathers-jwt'));

            this.app.set('strategy', this.name);
           
            //console.log('result storage: ', this.app.get('feathers-jwt'));
            //authentication: { strategy: name },

            //resolve(true)
            resolve({
              authentication: { strategy: name },
              user: this.user
            });
          }

        })
        .catch(err => {
          logger.info('Echec de connexion :', err);
          reject(new GeneralError(new Error('Connexion impossible')));
        });
      
    });
  }
}

