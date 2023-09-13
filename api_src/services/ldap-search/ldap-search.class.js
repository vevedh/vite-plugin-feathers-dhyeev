// This is a skeleton for a custom service class. Remove or add the methods you need here
import { decodeSearchEntry } from '../../decodeSearchEntry.js';
import { NotFound, GeneralError, BadRequest } from '@feathersjs/errors'
export class LdapSearchService {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
    
  }

  ldapSearch(filter) {


    const configuration = this.app.get('authentication').ldap
    const client = this.app.get('ldapClient')

    const filtre = String(filter.query)

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

    const opts = {
    //  filter: '(objectClass=*)',  //simple search
    //  filter: '(&(uid=2)(sn=John))',// and search
      filter: filtre, // '(&(samAccountType=805306368)(!(sn=Exchange))(mail=*))',//'(|(uid=*)(sAMAccountName=*))',//'(|(uid=2)(sn=John)(cn=Smith))', // or search
      scope: 'sub',
      sizeLimit: 5000,
      paged: true,
      attributes:['dn','mail','accountExpires','sn','givenName','title','physicalDeliveryOfficeName','telephoneNumber','objectClass','distinguishedName','memberOf','whenChanged','whenCreated','department','company','sAMAccountName','manager','userAccountControl','thumbnailPhoto'],
      explicitBufferAttributes: ['thumbnailPhoto']
    //attributes: adMap.filter(elt => attribs.includes(elt.ad)).map(obj => (obj.ld))
    }

    console.log('Filter :', filter)

    return new Promise((resolve, reject) => {
      console.log('Search...')
      if (!Date.fromLDAPString) {
        Date.fromLDAPString = function (s) {
          var b = s.match(/\d\d/g);
          return new Date(Date.UTC(b[0] + b[1], b[2] - 1, b[3], b[4], b[5], b[6]));
        }
      }

      var values = [];
      client.search(configuration.searchBase, {
          filter: filtre, 
          scope: 'sub',
          sizeLimit: 5000,
          paged: false,
          attributes:['dn','mail','accountExpires','sn','givenName','title','physicalDeliveryOfficeName','telephoneNumber','objectClass','distinguishedName','memberOf','whenChanged','whenCreated','department','company','sAMAccountName','manager','thumbnailPhoto','userAccountControl'],
          explicitBufferAttributes: ['thumbnailPhoto']
        }).then( async (values) => {
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
        resolve(value)
        
      }).catch((err) => { 
        
          console.log('Error in search ' + err);
         reject(new GeneralError(new Error('Error in search ' + err)))
      })

    })
  }

  async find(_params) {
    if (_params.query) {
      console.log('Search query :', _params.query)
      let search = await this.ldapSearch(_params.query);
      return search;
    } else {
      return [];
    }
  }

  async get(id, _params) {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }
  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
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
