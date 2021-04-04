const withImages = require('next-images')

const webpack = require('./webpack.config')

module.exports = withImages({
  distDir: 'build',
  webpack: config => {
    Object.assign(config.resolve.alias, webpack.resolve.alias)
    return config
  },
  reactStrictMode: false,
  baseUrl: './src',
  poweredByHeader: false,
  pageExtensions: ['p.js'],
  devIndicators: {
    autoPrerender: false
  },
  env: {
    DEV: process.env.NODE_ENV === 'development',
    API_URL: process.env.API_URL,
    API_KEY: process.env.API_KEY
  }
})
