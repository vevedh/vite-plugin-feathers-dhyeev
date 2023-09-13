// https://vitepress.dev/guide/custom-theme
// https://vitepress.dev/guide/custom-theme

import  DefaultTheme  from 'vitepress/theme'
import MyLayout from './MyLayout.vue'
import Layout from './Layout.vue'
import VVDoc from './components/VVDoc.vue'
import VVMyTableVue from './components/VVMyTable.vue'
import VVDatabases from './components/VVDatabases.vue';
import './style.css'
import { Quasar } from 'quasar'




export default {
  extends: DefaultTheme,
  Layout: MyLayout,/*() => {
  /*  return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      //'doc-top': () => h(MyDocTop)
      'home-hero-before': () => h(MyHomeHeroBefore)
    })
  },*/
  async enhanceApp({ app, router, siteData }) {
    // ...
    console.log('App :', app )

    app.use(Quasar,{
      
      config: {
        extras: [
          'mdi-v7',
          'fontawesome-v6'
        ],
        framework: {
          iconSet: 'fontawesome-v6'
        },
        brand: {
          primary: '#e46262',
          // ... or all other brand colors
        },
        
        components: [],
        
        //notify: {...},  default set of options for Notify Quasar plugin
        //loading: {...},  default set of options for Loading Quasar plugin
         // loadingBar: { ... },settings for LoadingBar Quasar plugin
        // ..and many more
      },

  

    }, { req: { headers: {} } })
    app.component(VVDatabases)
    app.component(VVMyTableVue)
    app.component(VVDoc)
    //const data = await (await fetch('http://localhost:3030/api/checkdb?database=databases')).json()
    //console.log('Datas :',data)
    //app.use(data)
    console.log('Router :', router)
    console.log('SiteData :', siteData)
    

  }
}
