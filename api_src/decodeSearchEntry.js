import base64js from 'base64-js';
function formatGuid(data) {
  var format = '{3}{2}{1}{0}-{5}{4}-{7}{6}-{8}{9}-{10}{11}{12}{13}{14}{15}';
  for (var i = 0; i < data.length; i++) {
    var re = new RegExp('\\{' + i + '\\}', 'g');
    // Leading 0 is needed if value of data[i] is less than 16 (of 10 as hex).
    var dataStr = data[i].toString(16);
    format = format.replace(re, data[i] >= 16 ? dataStr : '0' + dataStr);
  }
  return format;
}

export const decodeSearchEntry = function(entries) {
  if (!Date.fromLDAPString) {
    Date.fromLDAPString = function (s) {
      var b = s.match(/\d\d/g);
      return new Date(Date.UTC(b[0] + b[1], b[2] - 1, b[3], b[4], b[5], b[6]));
    };
  }

  let values

  if (entries) {
    if (Array.isArray(entries)) {
      values = []
      entries.forEach(entry => {
        var obj = {
          dn: entry.dn.toString(),
          controls: [],
          ...entry
        };
      //entry.attributes
        Object.entries(entry).forEach(function (a) {
          //var buf = a.buffers;
          let key = a[0];
          let val = a[1];
          let item;
          let thumbNail;
    
          switch (key) {
          case 'thumbnailPhoto':
            //item = buf;//buf.toString('base64');//buf;//base64js.fromByteArray(buf.toString('base64'));//Buffer.from(buf,'base64');//.toString('base64');
            thumbNail =  Buffer.from(val,'binary').toString('base64')
            obj.img64 = thumbNail; //Buffer.from(thumbNail,'utf8').toString('base64');//base64js.fromByteArray(thumbNail); //btoa(thumbNail);
            break;
          case 'userAccountControl':
              if ((val === '512')||(val === '544')||(val === '66048')){
                obj.enabled = 'true';
              } else {
                obj.enabled = 'false';
              }
            break;
          case 'accountExpires':
            // new Date(n/1e4 - 1.16444736e13);
            item = (new Date(Number(String(val.slice()).match(/\d/g).join('')) / 1e4 - 1.16444736e13)).toLocaleString('fr-FR');
            break;
          case 'lastLogon':
            item = (new Date(Number(String(val.slice()).match(/\d/g).join('')) / 1e4 - 1.16444736e13)).toLocaleString('fr-FR');
            break;
          case 'pwdLastSet':
            item = (new Date(Number(String(val.slice()).match(/\d/g).join('')) / 1e4 - 1.16444736e13)).toLocaleString('fr-FR');
            break;
          case 'badPasswordTime':
            item = (new Date(Number(String(val.slice()).match(/\d/g).join('')) / 1e4 - 1.16444736e13)).toLocaleString('fr-FR');
            break;
          case 'lastLogonTimestamp':
            item = (new Date(Number(String(val.slice()).match(/\d/g).join('')) / 1e4 - 1.16444736e13)).toLocaleString('fr-FR');
            break;
          case 'whenChanged':
            item = (new Date(Date.fromLDAPString(String(val.slice())))).toLocaleString('fr-FR');
            break;
          case 'modifyTimeStamp':
            item = (new Date(Date.fromLDAPString(String(val.slice())))).toLocaleString('fr-FR');
            break;
          case 'whenCreated':
            item = (new Date(Date.fromLDAPString(String(val.slice())))).toLocaleString('fr-FR');
            break;
          case 'msTSExpireDate':
            item = (new Date(Date.fromLDAPString(String(val.slice())))).toLocaleString('fr-FR');
            break;
          case 'objectGUID':
            item = formatGuid(val);
            break;
          default:
            item = val;
          }
    
          if (item && item.length) {
            if (item.length > 1) {
              obj[key] = item.slice();
            } else {
              obj[key] = item;
            }
          } else {
            obj[key] = [];
          }
        });
        values.push(obj);
      })

    } else {
      var obj = {
        dn: entry.dn.toString(),
        controls: [],
        ...entry
      };
    //entry.attributes
      Object.entries(entry).forEach(function (a) {
        //var buf = a.buffers;
        let key = a[0];
        let val = a[1];
        let item;
        let thumbNail;
  
        switch (key) {
        case 'thumbnailPhoto':
          //item = buf;//buf.toString('base64');//buf;//base64js.fromByteArray(buf.toString('base64'));//Buffer.from(buf,'base64');//.toString('base64');
          thumbNail =  Buffer.from(val,'binary').toString('base64')
          obj.img64 = thumbNail; //Buffer.from(thumbNail,'utf8').toString('base64');//base64js.fromByteArray(thumbNail); //btoa(thumbNail);
          break;
        case 'userAccountControl':
          if ((val === '512')||(val === '544')||(val === '66048')){
            obj.enabled = true;
          } else {
            obj.enabled = false;
          }
          break;
        case 'accountExpires':
          // new Date(n/1e4 - 1.16444736e13);
          item = (new Date(Number(String(val.slice()).match(/\d/g).join('')) / 1e4 - 1.16444736e13)).toLocaleString('fr-FR');
          break;
        case 'lastLogon':
          item = (new Date(Number(String(val.slice()).match(/\d/g).join('')) / 1e4 - 1.16444736e13)).toLocaleString('fr-FR');
          break;
        case 'pwdLastSet':
          item = (new Date(Number(String(val.slice()).match(/\d/g).join('')) / 1e4 - 1.16444736e13)).toLocaleString('fr-FR');
          break;
        case 'badPasswordTime':
          item = (new Date(Number(String(val.slice()).match(/\d/g).join('')) / 1e4 - 1.16444736e13)).toLocaleString('fr-FR');
          break;
        case 'lastLogonTimestamp':
          item = (new Date(Number(String(val.slice()).match(/\d/g).join('')) / 1e4 - 1.16444736e13)).toLocaleString('fr-FR');
          break;
        case 'whenChanged':
          item = (new Date(Date.fromLDAPString(String(val.slice())))).toLocaleString('fr-FR');
          break;
        case 'modifyTimeStamp':
          item = (new Date(Date.fromLDAPString(String(val.slice())))).toLocaleString('fr-FR');
          break;
        case 'whenCreated':
          item = (new Date(Date.fromLDAPString(String(val.slice())))).toLocaleString('fr-FR');
          break;
        case 'msTSExpireDate':
          item = (new Date(Date.fromLDAPString(String(val.slice())))).toLocaleString('fr-FR');
          break;
        case 'objectGUID':
          item = formatGuid(val);
          break;
        default:
          item = val;
        }
  
        if (item && item.length) {
          if (item.length > 1) {
            obj[key] = item.slice();
          } else {
            obj[key] = item;
          }
        } else {
          obj[key] = [];
        }
      });
      values = obj
    }
    
  } else {
    console.log("Invalid :",entry)
    values = []
  }

  

  return values;
};
