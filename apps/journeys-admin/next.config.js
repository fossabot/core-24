const withNx = require('@nrwl/next/plugins/with-nx')
const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
const { i18n } = require('./next-i18next.config')

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  i18n,
  images: {
    domains: [
      'images.unsplash.com',
      'localhost',
      'unsplash.com',
      'imagizer.imageshack.com'
    ]
  },
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false
  },
  async redirects() {
    return [
      {
        source: '/journeys',
        destination: '/',
        permanent: true
      }
    ]
  },
  productionBrowserSourceMaps: true
}

module.exports = withPlugins(
  [[withBundleAnalyzer], [withImages], [withNx]],
  nextConfig
)
