import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import { SSRConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { PageWrapper } from '../../src/components/PageWrapper'
import { LanguageProvider } from '../../src/libs/languageContext/LanguageContext'
import { Countries } from '../../src/components/Countries/Countries'

function CountriesPage(): ReactElement {
  return (
    <LanguageProvider>
      <PageWrapper />
      <Countries />
    </LanguageProvider>
  )
}

export const getStaticProps: GetStaticProps<SSRConfig> = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', ['apps-watch'])) // namespaces your components make use of
    }
  }
}

export default CountriesPage
