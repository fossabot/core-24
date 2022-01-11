import { join } from 'path'
import { Module } from '@nestjs/common'
import { GraphQLFederationModule } from '@nestjs/graphql'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    UserModule,
    GraphQLFederationModule.forRoot({
      typePaths: [
        join(process.cwd(), 'apps/api-users/src/app/**/*.graphql'),
        join(process.cwd(), 'assets/**/*.graphql')
      ],
      cors: true,
      context: ({ req }) => ({ headers: req.headers })
    })
  ]
})
export class AppModule {}
