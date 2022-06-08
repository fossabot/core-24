import { createElement } from 'react'
import i18n from './i18next'

const NextImage = require('next/image')
const OriginalNextImage = NextImage.default

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props) =>
    createElement(OriginalNextImage, { ...props, unoptimized: true })
})

const customViewports = {
  mobileMin: {
    name: 'Small Mobile',
    styles: {
      width: '360px',
      height: '640px'
    },
    type: 'mobile'
  },
  mobileMax: {
    name: 'Large Mobile',
    styles: {
      width: '540px',
      height: '960px'
    },
    type: 'mobile'
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '768px',
      height: '1024px'
    },
    type: 'tablet'
  }
}

export const parameters = {
  backgrounds: {
    disable: true,
    grid: {
      disable: true
    }
  },
  chromatic: { viewports: [360, 1200] },
  controls: { disabled: true },
  viewport: {
    viewports: customViewports
  },
  i18n,
  locale: 'en',
  locales: {
    en: 'English',
    af: 'Afrikaans',
    mi: 'Maori'
  }
}

export const globalTypes = {
  theme: {
    name: 'Theme Mode',
    description: 'Display mode for components',
    defaultValue: 'all',
    toolbar: {
      icon: 'mirror',
      items: ['light', 'dark', 'all']
    }
  }
}
