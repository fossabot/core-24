import { ReactElement } from 'react'
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR
} from 'next-firebase-auth'
import { NextSeo } from 'next-seo'
import Container from '@mui/material/Container'
import { addApolloState, initializeApollo } from '../src/libs/apolloClient'
import { PageWrapper } from '../src/components/PageWrapper'
import { Videos } from '../src/components/Videos/Videos'

function IndexPage(): ReactElement {
  const AuthUser = useAuthUser()

  return (
    <>
      <NextSeo title="Watch Admin" />
      <PageWrapper title="Watch Admin" AuthUser={AuthUser}>
        <Container>
          <Videos />
        </Container>
      </PageWrapper>
    </>
  )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})(async ({ AuthUser }) => {
  const apolloClient = initializeApollo({
    token: (await AuthUser.getIdToken()) ?? ''
  })

  return addApolloState(apolloClient, {
    props: {}
  })
})

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(IndexPage)
