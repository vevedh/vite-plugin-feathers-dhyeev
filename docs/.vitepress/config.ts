import { fileURLToPath } from 'node:url'
import { UserConfig, defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "API Services",
  lang: "fr",
  locales: {
    root: {
      label: 'Francais',
      lang: 'fr',
    }
  },
  description: "Serveur Backend d'API(s) de la CACEM",
  head: [
    ['link', { rel: 'stylesheet', href:'https://unpkg.com/tailwindcss@2.0.4/dist/tailwind.min.css' }],
    ['link', { rel: 'stylesheet', href:'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons|Material+Icons+Outlined|Material+Icons+Round|Material+Icons+Sharp'}],
    ['link', { rel: 'stylesheet', href:'https://use.fontawesome.com/releases/v5.15.4/css/all.css'}],
    ['link', { rel: 'stylesheet', href:'https://use.fontawesome.com/releases/v6.1.1/css/all.css'}],
    ['link', { rel: 'stylesheet', href:'https://cdn.jsdelivr.net/npm/quasar@2.12.6/dist/quasar.prod.css'}]
],
  themeConfig: {
    logo: "/cacemx200.png",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Accueil', link: '/' },
      { text: 'Services', link: '/presentation' }
    ],

    sidebar: [
      {
        text: 'Présentation',
        link: '/presentation',
        collapsed:true,
        items: [
          { text: 'Bases de données', link: '/pages/databases'}
        ]
        
      },
      {
        text: 'Services',
        collapsed: true,
        collapse: true,
        items: [
          { text: '<span class="q-pa-none text-xs">Agents API Agents</span>', link: '/api-agents' },
          { text: '<span class="q-pa-none text-xs">Agents API Examples</span>', link: '/api-examples' },
        ]
      }
    ],

    socialLinks: [
      //{ icon: 'github', link: 'https://github.com/CACEM-TEAM/bke-dsi-cacem' }
    ],
    footer: {
      message: "Support DSI CACEM.",
      copyright: "Copyright © 2023-present DSI CACEM",
    },
  },
  vue: {
    //customElement: /^.*\/VVImage\.vue$/

  },
  vite: {
    
    resolve: {
      alias: [
        {
          find: /^.*\/VPImage\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/VVImage.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPDoc\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/VVDoc.vue', import.meta.url)
          )
        }
      ]
    },
    plugins: [
      {
         async config(config:UserConfig)  {
          
            const infos = await (await fetch('http://localhost:3030/api/checkdb?database=databases')).json()
            //console.log('Infos :',infos)
            const sideDatabases = infos.map( (infoDb: { name: any; tables: any[] }) => {
              const sb = { text: `<span class="dbname" >&nbsp;&nbsp;<b>${infoDb.name}</b></span>` , collapsed:true, collapse:true, items: infoDb.tables.map((col) => {return {text:col.name,link:`/pages/col-${infoDb.name}-${col.name}.md`}})}
              return sb
            })
            console.log('Infos :',sideDatabases)
            const obj = { text: `<span class="dbIcon"><i class="fa-solid fa-database"></i> Bases MongoDb</span>`, collapsed:true, collapse:true, items: [] }
            
            sideDatabases.forEach(element => {
              obj.items.push(element)
            });
            console.log('Infos SideBar :',config.vitepress.site.themeConfig.sidebar)
            
            if (!(config.vitepress.site.themeConfig.sidebar.find(elt => (elt.text as String).includes('Bases MongoDb')))) {
              config.vitepress.site.themeConfig.sidebar.push(obj)
            }
            console.log('Has base :',config.vitepress.site.themeConfig.sidebar.find(elt => (elt.text as String).includes('Bases MongoDb')))
        
        },

      }

    ]
  }
})
