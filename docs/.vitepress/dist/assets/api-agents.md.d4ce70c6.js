import{_ as s,c as e,o as a,P as t}from"./chunks/framework.af328a25.js";const g=JSON.parse('{"title":"API Agents","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"api-agents.md","filePath":"api-agents.md"}'),o={name:"api-agents.md"},n=t(`<h1 id="api-agents" tabindex="-1">API Agents <a class="header-anchor" href="#api-agents" aria-label="Permalink to &quot;API Agents&quot;">​</a></h1><p>Description de l&#39;API REST Agents.</p><p>Tous les paramètres de requête d&#39;une URL seront définis en tant que <code>params.query</code> sur le serveur.</p><p>D&#39;autres paramètres de service peuvent être définis par le biais de <a href="./.html">hooks</a> et <a href="./.html">Express middleware</a>. Les valeurs des paramètres de requête de l&#39;URL seront toujours des chaînes de caractères. La conversion (par exemple, la chaîne <code>&#39;true&#39;</code> en booléen <code>true</code>) peut également être effectuée dans un <code>hook</code>.</p><p>Voici la correspondance entre les méthodes de service et les appels à l&#39;API REST :</p><table><thead><tr><th>Service method</th><th>HTTP method</th><th>Path</th></tr></thead><tbody><tr><td>.find()</td><td>GET</td><td>/api/v1/agents</td></tr><tr><td>.get()</td><td>GET</td><td>/api/v1/agents/toto</td></tr><tr><td>.create()</td><td>POST</td><td>/api/v1/agents</td></tr><tr><td>.update()</td><td>PUT</td><td>/api/v1/agents/tata</td></tr><tr><td>.patch()</td><td>PATCH</td><td>/api/v1/agents/tata</td></tr><tr><td>.remove()</td><td>DELETE</td><td>/api/v1/agents/toto</td></tr></tbody></table><h3 id="authentication" tabindex="-1">Authentication <a class="header-anchor" href="#authentication" aria-label="Permalink to &quot;Authentication&quot;">​</a></h3><p>L&#39;authentification des requêtes HTTP (REST) se fait en deux étapes. Tout d&#39;abord, vous devez obtenir un JWT du service d&#39;<a href="./.html">authentication service</a> en postant la stratégie que vous souhaitez utiliser :</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// POST /authentication the Content-Type header set to application/json</span></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">&quot;strategy&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;local&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">&quot;username&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;username&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">&quot;password&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;password&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// POST /authentication the Content-Type header set to application/json</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">&quot;strategy&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;local&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">&quot;username&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;username&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">&quot;password&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;password&quot;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>Dans notre cas c&#39;est la statégie LDAP</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// POST /authentication the Content-Type header set to application/json</span></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">&quot;strategy&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;ldap&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">&quot;username&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;username&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">&quot;password&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;password&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// POST /authentication the Content-Type header set to application/json</span></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">&quot;strategy&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;ldap&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">&quot;username&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;username&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">&quot;password&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;password&quot;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>Voici ce que cela donne avec curl :</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">curl</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-H</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;Content-Type: application/json&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-X</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">POST</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-d</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;{&quot;strategy&quot;:&quot;ldap&quot;,&quot;username&quot;:&quot;nom d&#39;utilisateur&quot;,&quot;password&quot;:&quot;votre</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">mot</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">de</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">passe&quot;}&#39; https://svrapi.agglo.local/authentication</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">curl</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-H</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;Content-Type: application/json&quot;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-X</span><span style="color:#24292E;"> </span><span style="color:#032F62;">POST</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-d</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;{&quot;strategy&quot;:&quot;ldap&quot;,&quot;username&quot;:&quot;nom d&#39;utilisateur&quot;,&quot;password&quot;:&quot;votre</span><span style="color:#24292E;"> </span><span style="color:#032F62;">mot</span><span style="color:#24292E;"> </span><span style="color:#032F62;">de</span><span style="color:#24292E;"> </span><span style="color:#032F62;">passe&quot;}&#39; https://svrapi.agglo.local/authentication</span></span></code></pre></div><p>Ensuite, pour authentifier les demandes ultérieures, ajoutez l&#39;<code>accessToken</code> renvoyé à l&#39;en-tête <code>Authorization</code> en tant que <code>Bearer &lt;your access token&gt;</code>:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">curl</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-H</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;Content-Type: application/json&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-H</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;Authorization: Bearer &lt;your access token&gt;&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">https://svrapi.agglo.local/api/v1/agents</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">curl</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-H</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;Content-Type: application/json&quot;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-H</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;Authorization: Bearer &lt;your access token&gt;&quot;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">https://svrapi.agglo.local/api/v1/agents</span></span></code></pre></div><h3 id="find" tabindex="-1">find <a class="header-anchor" href="#find" aria-label="Permalink to &quot;find&quot;">​</a></h3><p>List des Agents</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">GET /api/v1/agents?affectation.service=DIRECTION SYSTEMES D&#39;INFORMATION</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">GET /api/v1/agents?affectation.service=DIRECTION SYSTEMES D&#39;INFORMATION</span></span></code></pre></div><p>Will call <code>agents.find({ query: { status: &#39;read&#39;, user: &#39;10&#39; } })</code> on the server.</p><p>If you want to use any of the built-in find operands ($le, $lt, $ne, $eq, $in, etc.) the general format is as follows:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">GET /agents?field[$operand]=value&amp;field[$operand]=value2</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">GET /agents?field[$operand]=value&amp;field[$operand]=value2</span></span></code></pre></div><p>For example, to find the records where field <em>status</em> is not equal to <strong>active</strong> you could do</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">GET /agents?status[$ne]=active</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">GET /agents?status[$ne]=active</span></span></code></pre></div><p>The find API allows the use of $limit, $skip, $sort, and $select in the query. These special parameters can be passed directly inside the query object:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">// Find all agents that are read, limit to 10, only include text field.</span></span>
<span class="line"><span style="color:#e1e4e8;">{&quot;read&quot;:&quot;1&quot;, &quot;$limit&quot;:10, &quot;$select&quot;: [&quot;name&quot;] } } // JSON</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">GET /agents?read=1&amp;$limit=10&amp;$select[]=text // HTTP</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">// Find all agents that are read, limit to 10, only include text field.</span></span>
<span class="line"><span style="color:#24292e;">{&quot;read&quot;:&quot;1&quot;, &quot;$limit&quot;:10, &quot;$select&quot;: [&quot;name&quot;] } } // JSON</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">GET /agents?read=1&amp;$limit=10&amp;$select[]=text // HTTP</span></span></code></pre></div><p>More information about the possible parameters for official database adapters can be found <a href="./.html">in the database querying section</a>.</p><h3 id="get" tabindex="-1">get <a class="header-anchor" href="#get" aria-label="Permalink to &quot;get&quot;">​</a></h3><p>Retrieve a single resource from the service.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">GET /agents/1</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">GET /agents/1</span></span></code></pre></div><p>Will call <code>agents.get(1, {})</code> on the server.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">GET /agents/1?fetch=all</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">GET /agents/1?fetch=all</span></span></code></pre></div><p>Will call <code>agents.get(1, { query: { fetch: &#39;all&#39; } })</code> on the server.</p><h3 id="create" tabindex="-1">create <a class="header-anchor" href="#create" aria-label="Permalink to &quot;create&quot;">​</a></h3><p>Create a new resource with <code>data</code> which may also be an array.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">POST /agents</span></span>
<span class="line"><span style="color:#e1e4e8;">{ &quot;text&quot;: &quot;I really have to iron&quot; }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">POST /agents</span></span>
<span class="line"><span style="color:#24292e;">{ &quot;text&quot;: &quot;I really have to iron&quot; }</span></span></code></pre></div><p>Will call <code>agents.create({ &quot;text&quot;: &quot;I really have to iron&quot; }, {})</code> on the server.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">POST /agents</span></span>
<span class="line"><span style="color:#e1e4e8;">[</span></span>
<span class="line"><span style="color:#e1e4e8;">  { &quot;text&quot;: &quot;I really have to iron&quot; },</span></span>
<span class="line"><span style="color:#e1e4e8;">  { &quot;text&quot;: &quot;Do laundry&quot; }</span></span>
<span class="line"><span style="color:#e1e4e8;">]</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">POST /agents</span></span>
<span class="line"><span style="color:#24292e;">[</span></span>
<span class="line"><span style="color:#24292e;">  { &quot;text&quot;: &quot;I really have to iron&quot; },</span></span>
<span class="line"><span style="color:#24292e;">  { &quot;text&quot;: &quot;Do laundry&quot; }</span></span>
<span class="line"><span style="color:#24292e;">]</span></span></code></pre></div><blockquote><p><strong>Note:</strong> With a <a href="./.html">database adapters</a> the <a href="./.html"><code>multi</code> option</a> has to be set explicitly to support creating multiple entries.</p></blockquote><h3 id="update" tabindex="-1">update <a class="header-anchor" href="#update" aria-label="Permalink to &quot;update&quot;">​</a></h3><p>Completely replace a single or multiple resources.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">PUT /agents/2</span></span>
<span class="line"><span style="color:#e1e4e8;">{ &quot;text&quot;: &quot;I really have to do laundry&quot; }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">PUT /agents/2</span></span>
<span class="line"><span style="color:#24292e;">{ &quot;text&quot;: &quot;I really have to do laundry&quot; }</span></span></code></pre></div><p>Will call <code>agents.update(2, { &quot;text&quot;: &quot;I really have to do laundry&quot; }, {})</code> on the server. When no <code>id</code> is given by sending the request directly to the endpoint something like:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">PUT /agents?complete=false</span></span>
<span class="line"><span style="color:#e1e4e8;">{ &quot;complete&quot;: true }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">PUT /agents?complete=false</span></span>
<span class="line"><span style="color:#24292e;">{ &quot;complete&quot;: true }</span></span></code></pre></div><p>Will call <code>agents.update(null, { &quot;complete&quot;: true }, { query: { complete: &#39;false&#39; } })</code> on the server.</p><blockquote><p><strong>ProTip:</strong> <code>update</code> is normally expected to replace an entire resource which is why the database adapters only support <code>patch</code> for multiple records.</p></blockquote><h3 id="patch" tabindex="-1">patch <a class="header-anchor" href="#patch" aria-label="Permalink to &quot;patch&quot;">​</a></h3><p>Merge the existing data of a single or multiple resources with the new <code>data</code>.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">PATCH /agents/2</span></span>
<span class="line"><span style="color:#e1e4e8;">{ &quot;read&quot;: true }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">PATCH /agents/2</span></span>
<span class="line"><span style="color:#24292e;">{ &quot;read&quot;: true }</span></span></code></pre></div><p>Will call <code>agents.patch(2, { &quot;read&quot;: true }, {})</code> on the server. When no <code>id</code> is given by sending the request directly to the endpoint something like:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">PATCH /agents?complete=false</span></span>
<span class="line"><span style="color:#e1e4e8;">{ &quot;complete&quot;: true }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">PATCH /agents?complete=false</span></span>
<span class="line"><span style="color:#24292e;">{ &quot;complete&quot;: true }</span></span></code></pre></div><p>Will call <code>agents.patch(null, { complete: true }, { query: { complete: &#39;false&#39; } })</code> on the server to change the status for all read agents.</p><blockquote><p><strong>Note:</strong> With a <a href="./.html">database adapters</a> the <a href="./.html"><code>multi</code> option</a> has to be set to support patching multiple entries.</p></blockquote><p>This is supported out of the box by the Feathers <a href="./.html">database adapters</a></p><h3 id="remove" tabindex="-1">remove <a class="header-anchor" href="#remove" aria-label="Permalink to &quot;remove&quot;">​</a></h3><p>Remove a single or multiple resources:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">DELETE /agents/2?cascade=true</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">DELETE /agents/2?cascade=true</span></span></code></pre></div><p>Will call <code>agents.remove(2, { query: { cascade: &#39;true&#39; } })</code>.</p><p>When no <code>id</code> is given by sending the request directly to the endpoint something like:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">DELETE /agents?read=true</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">DELETE /agents?read=true</span></span></code></pre></div><p>Will call <code>agents.remove(null, { query: { read: &#39;true&#39; } })</code> to delete all read agents.</p><blockquote><p><strong>Note:</strong> With a <a href="./.html">database adapters</a> the <a href="./.html"><code>multi</code> option</a> has to be set to support patching multiple entries.</p></blockquote><h2 id="plus" tabindex="-1">Plus <a class="header-anchor" href="#plus" aria-label="Permalink to &quot;Plus&quot;">​</a></h2>`,62),l=[n];function p(c,r,i,d,u,h){return a(),e("div",null,l)}const q=s(o,[["render",p]]);export{g as __pageData,q as default};
