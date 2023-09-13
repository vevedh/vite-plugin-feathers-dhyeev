---
outline: deep
---

# API Agents

Description de l'API REST  Agents.

Tous les paramètres de requête d'une URL seront définis en tant que `params.query` sur le serveur. 

D'autres paramètres de service peuvent être définis par le biais de [hooks]() et [Express middleware]().
Les valeurs des paramètres de requête de l'URL seront toujours des chaînes de caractères. La conversion (par exemple, la chaîne `'true'` en booléen `true`) peut également être effectuée dans un `hook`.

Voici la correspondance entre les méthodes de service et les appels à l'API REST :

| Service method  | HTTP method | Path        |
|-----------------|-------------|-------------|
| .find()         | GET         | /api/v1/agents   |
| .get()          | GET         | /api/v1/agents/toto |
| .create()       | POST        | /api/v1/agents   |
| .update()       | PUT         | /api/v1/agents/tata |
| .patch()        | PATCH       | /api/v1/agents/tata |
| .remove()       | DELETE      | /api/v1/agents/toto |

### Authentication

L'authentification des requêtes HTTP (REST) se fait en deux étapes. Tout d'abord, vous devez obtenir un JWT du service d'[authentication service]() en postant la stratégie que vous souhaitez utiliser :

```json
// POST /authentication the Content-Type header set to application/json
{
  "strategy": "local",
  "username": "username",
  "password": "password"
}
```

Dans notre cas c'est la statégie LDAP

```json
// POST /authentication the Content-Type header set to application/json
{
  "strategy": "ldap",
  "username": "username",
  "password": "password"
}
```

Voici ce que cela donne avec curl :

```bash
curl -H "Content-Type: application/json" -X POST -d '{"strategy":"ldap","username":"nom d'utilisateur","password":"votre mot de passe"}' https://svrapi.agglo.local/authentication
```

Ensuite, pour authentifier les demandes ultérieures, ajoutez l'`accessToken` renvoyé à l'en-tête `Authorization` en tant que `Bearer <your access token>`:

```bash
curl -H "Content-Type: application/json" -H "Authorization: Bearer <your access token>" https://svrapi.agglo.local/api/v1/agents
```


### find

List des Agents 

```
GET /api/v1/agents?affectation.service=DIRECTION SYSTEMES D'INFORMATION
```

Will call `agents.find({ query: { status: 'read', user: '10' } })` on the server.

If you want to use any of the built-in find operands ($le, $lt, $ne, $eq, $in, etc.) the general format is as follows:

```
GET /agents?field[$operand]=value&field[$operand]=value2
```

For example, to find the records where field _status_ is not equal to **active** you could do

```
GET /agents?status[$ne]=active
```

The find API allows the use of $limit, $skip, $sort, and $select in the query. These special parameters can be passed directly inside the query object:

```
// Find all agents that are read, limit to 10, only include text field.
{"read":"1", "$limit":10, "$select": ["name"] } } // JSON

GET /agents?read=1&$limit=10&$select[]=text // HTTP
```

More information about the possible parameters for official database adapters can be found [in the database querying section]().

### get

Retrieve a single resource from the service.

```
GET /agents/1
```

Will call `agents.get(1, {})` on the server.

```
GET /agents/1?fetch=all
```

Will call `agents.get(1, { query: { fetch: 'all' } })` on the server.

### create

Create a new resource with `data` which may also be an array.

```
POST /agents
{ "text": "I really have to iron" }
```

Will call `agents.create({ "text": "I really have to iron" }, {})` on the server.

```
POST /agents
[
  { "text": "I really have to iron" },
  { "text": "Do laundry" }
]
```

> **Note:** With a [database adapters]() the [`multi` option]() has to be set explicitly to support creating multiple entries.

### update

Completely replace a single or multiple resources.

```
PUT /agents/2
{ "text": "I really have to do laundry" }
```

Will call `agents.update(2, { "text": "I really have to do laundry" }, {})` on the server. When no `id` is given by sending the request directly to the endpoint something like:

```
PUT /agents?complete=false
{ "complete": true }
```

Will call `agents.update(null, { "complete": true }, { query: { complete: 'false' } })` on the server.

> **ProTip:** `update` is normally expected to replace an entire resource which is why the database adapters only support `patch` for multiple records.

### patch

Merge the existing data of a single or multiple resources with the new `data`.

```
PATCH /agents/2
{ "read": true }
```

Will call `agents.patch(2, { "read": true }, {})` on the server. When no `id` is given by sending the request directly to the endpoint something like:

```
PATCH /agents?complete=false
{ "complete": true }
```

Will call `agents.patch(null, { complete: true }, { query: { complete: 'false' } })` on the server to change the status for all read agents.

> **Note:** With a [database adapters]() the [`multi` option]() has to be set to support patching multiple entries.

This is supported out of the box by the Feathers [database adapters]() 

### remove

Remove a single or multiple resources:

```
DELETE /agents/2?cascade=true
```

Will call `agents.remove(2, { query: { cascade: 'true' } })`.

When no `id` is given by sending the request directly to the endpoint something like:

```
DELETE /agents?read=true
```

Will call `agents.remove(null, { query: { read: 'true' } })` to delete all read agents.

> **Note:** With a [database adapters]() the [`multi` option]() has to be set to support patching multiple entries.




## Plus