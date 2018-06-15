module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Nimiq-Mining.com',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {name: 'msapplication-TileColor', content: '#3023ae'},
      {name: 'theme-color', content: '#ffffff'}
    ],
    link: [
      {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'},
      {rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png'},
      {rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png'},
      {rel: 'manifest', href: '/site.webmanifest'},
      {rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#3023ae'},
    ],
    script: [
      {src: 'https://cdn.nimiq.com/nimiq.js'}
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: {color: '#FFC107'},
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend(config, {isDev, isClient}) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  generate: {
    fallback: true
  },
  modules: [
    'bootstrap-vue/nuxt',
    ['@nuxtjs/google-analytics', {
      id: 'UA-120855854-1'
    }]
  ],
  plugins: [
    '~/plugins/friendlyHashrate.js',
    {src: '~/plugins/localStorage.js', ssr: false}
  ]
}
