/* eslint-disable linebreak-style */
import * as PowerShell from 'powershell';

import {logger} from './logger.js';

export const powershell = (app) =>  {
  const runPowerShell = (cmd) => {
    return new Promise((resolve, reject) => {
      //$username = "admexchange@agglo.local"; $password = ConvertTo-SecureString "F" -AsPlainText -Force; $usercred = New-Object System.Management.Automation.PSCredential -ArgumentList ($username, $password); $session = New-PSSession -ConfigurationName Microsoft.Exchange -ConnectionUri http://svrexchg1.agglo.local/PowerShell -Authentication Kerberos -Credential $usercred  -AllowRedirection ;  Invoke-Command -Session $session -scriptblock {${cmd}} |ConvertTo-Json//${cmd}`,
      var psShell = new PowerShell(
        ` $username = "${process.env.AD_USERNAME}"; $password = ConvertTo-SecureString "${process.env.AD_PASSWORD}" -AsPlainText -Force; $usercred = New-Object System.Management.Automation.PSCredential -ArgumentList ($username, $password);  Invoke-Command -ComputerName ${app.get('dc')} -Authentication Negotiate -Credential $usercred -scriptblock {  ${cmd} } `,
        {
          executionPolicy: 'Bypass',
          outputEncoding: 'utf-8',
          noProfile: true,
          PSCore: true,
        }
      );

      psShell.on('error', (err) => {
        logger.info('powershell:'+err);
        reject(err);
      });

      // Stdout

      psShell.on('output', (data) => {
        //logger.info(data);
        resolve(data);
      });

      // Stderr
      psShell.on('error-output', (data) => {
        logger.info(data);
        reject(data);
      });

      // End
      psShell.on('end', (code) => {
        // Do Something on end
        //logger.info(code);
        psShell = null;
      });
    });
  };
  const runScriptShell = (filepath) => {


    return new Promise((resolve, reject) => {
      /*var psShell   = new npwrshell(`$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = [System.Text.UTF8Encoding]::new(); ${cmd}`,{
        executionPolicy: 'Bypass',
        outputEncoding: 'utf-8',
        noProfile: true
      });*/
      var psShell = new PowerShell(
        ` $username = "${process.env.AD_USERNAME}}"; $password = ConvertTo-SecureString "${process.env.AD_PASSWORD}" -AsPlainText -Force; $usercred = New-Object System.Management.Automation.PSCredential -ArgumentList ($username, $password);  Invoke-Command -ComputerName ${app.get('dc')} -Authentication Negotiate -Credential $usercred -FilePath   ${filepath}  `,
        {
          executionPolicy: 'Bypass',
          outputEncoding: 'utf-8',
          noProfile: true,
          PSCore: true
        }
      );

      psShell.on('error', err => {
        logger.info(err);
        reject(err);
      });

      // Stdout

      psShell.on('output', data => {
       // logger.info(data);
        resolve(data);
      });

      // Stderr
      psShell.on('error-output', data => {
        logger.info(data);
        reject(data);
      });

      // End
      psShell.on('end', code => {
        // Do Something on end
        psShell = null;
      });
    });

  };
  app.set('pwshCmd', runPowerShell);
  app.set('pwshScript', runScriptShell);
};
