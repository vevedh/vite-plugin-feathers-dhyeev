module.exports = {
    purge: {
      enabled: process.env.NODE_ENV === 'production',
      content: [
        './docs/.vitepress/**/*.js',
        './docs/.vitepress/**/*.vue',
        './docs/.vitepress/**/*.ts',
      ],
      options: {
        safelist: ['html', 'body'],
      },
    },
    extend: {
      backgroundImage: {
        'fdsi': "url('./public/DSi_bg1.png')",
      },
    }
  }