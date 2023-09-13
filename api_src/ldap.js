
import { logger } from './logger.js'
import { Client } from 'ldapts';
import fs from 'fs'

export const ldap = function (app) {
  /*
  bindDN:configuration.bindDN,
    bindCredentials: configuration.bindCredentials,
    reconnect: true,
    idleTimeout: 2592000,
    tlsOptions: { rejectUnauthorized: false }
  */
  const configuration = app.get('authentication').ldap;
  const clientLdap =  new Client({
    url: configuration.url,
    timeout: 0,
    connectTimeout: 0,
    tlsOptions: { 
      ca: fs.readFileSync(configuration.certca)
    },
    /*tlsOptions: {
      minVersion: 'TLSv1.2',
    },*/
    strictDN: false,

  });
  app.set('ldapClient', clientLdap);

  logger.info('Ldap configuration : %j', configuration);
  if (clientLdap.connected) {
    try {
      clientLdap.undind();
    } catch (error) {
      console.log('Fermer avant la connexion');
    }


  }
  logger.info('Ldap connexionbinDN : %j', configuration.bindDN);
  logger.info('Ldap connexion credentials : %j', configuration.bindCredentials);
  clientLdap.bind(configuration.bindDN, configuration.bindCredentials).then( () => {
    logger.info('Connexion init ldap etablie avec succès!');


      if (clientLdap.connected) {
        logger.info('Connexion init ldap etablie settings!');
        app.set('ldapClient', clientLdap);
        app.set('ldap_ok', true);
      }

  }).catch((err)=>{
    logger.info('Echec init de connexion ldap !');
    app.set('ldap_ok', false);
  });
};
