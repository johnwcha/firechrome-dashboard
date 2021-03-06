import colors from 'vuetify/es5/util/colors'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - firechrome-dashboard',
    title: 'firechrome-dashboard',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],
  // firestore: {
  //   memoryOnly: false, // default
  //   chunkName: process.env.NODE_ENV !== 'production' ? 'firebase-auth' : '[id]', // default
  //   enablePersistence: true,
  //   emulatorPort: 8080,
  //   emulatorHost: 'localhost',
  //   settings: {
  //   }
  // },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: "AIzaSyDsNDbL3JYa46SiP0F9wu0YwGF_06oHm_U",
          authDomain: "firechrome-817a7.firebaseapp.com",
          databaseURL: "https://firechrome-817a7.firebaseio.com",
          projectId: "firechrome-817a7",
          storageBucket: "firechrome-817a7.appspot.com",
          messagingSenderId: "664618879744",
          appId: "1:664618879744:web:a0fbd713809b80e09d41e5",
          measurementId: "G-FGP2MZR8K3"
        },
        services: {
          firestore: {
            settings: {
              host: 'localhost:8080',
              ssl: false
            }
          },
          auth: true // Just as example. Can be any other service.
        }
      }
    ]
  ],
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // dev notes about opencc-js
    // use @ 0.2.1 version and comment out line 1
    // if typeof window ..., just require('node-fetch')
    // 為 converting to simp gives an extra char, \r
    // do this: this.subsimp = this.subsimp.replace('\r', '')
    // 
  }
}
