const path = require('path')

module.exports = {
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      config: path.resolve(__dirname, 'src/config'),
      images: path.resolve(__dirname, 'src/images'),
      libs: path.resolve(__dirname, 'src/libs'),
      pages: path.resolve(__dirname, 'src/pages'),
      store: path.resolve(__dirname, 'src/store'),
      utils: path.resolve(__dirname, 'src/utils'),
      styles: path.resolve(__dirname, 'src/styles'),
    },
  },
}
