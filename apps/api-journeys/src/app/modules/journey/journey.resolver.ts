import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from '@nestjs/graphql'
import { CurrentUserId } from '@core/nest/decorators/CurrentUserId'
import slugify from 'slugify'
import { UseGuards } from '@nestjs/common'
import {
  getPowerBiEmbed,
  PowerBiEmbed
} from '@core/nest/powerBi/getPowerBiEmbed'
import {
  ApolloError,
  ForbiddenError,
  UserInputError
} from 'apollo-server-errors'
import { GqlAuthGuard } from '@core/nest/gqlAuthGuard/GqlAuthGuard'
import { v4 as uuidv4 } from 'uuid'

import { BlockService } from '../block/block.service'
import {
  Block,
  IdType,
  ImageBlock,
  Journey,
  JourneyCreateInput,
  JourneyStatus,
  JourneyUpdateInput,
  ThemeMode,
  ThemeName,
  UserJourney,
  UserJourneyRole,
  JourneysFilter,
  JourneysReportType
} from '../../__generated__/graphql'
import { UserJourneyService } from '../userJourney/userJourney.service'
import { RoleGuard } from '../../lib/roleGuard/roleGuard'
import { JourneyService } from './journey.service'

const ERROR_ARANGO_UNIQUE_CONSTRAINT_VIOLATED = 1210

@Resolver('Journey')
export class JourneyResolver {
  constructor(
    private readonly journeyService: JourneyService,
    private readonly blockService: BlockService,
    private readonly userJourneyService: UserJourneyService
  ) {}

  @Query()
  async adminJourneysReport(
    @CurrentUserId() userId: string,
    @Args('reportType') reportType: JourneysReportType
  ): Promise<PowerBiEmbed> {
    let reportId: string | undefined
    switch (reportType) {
      case JourneysReportType.multipleFull:
        reportId = process.env.POWER_BI_JOURNEYS_MULTIPLE_FULL_REPORT_ID
        break
      case JourneysReportType.multipleSummary:
        reportId = process.env.POWER_BI_JOURNEYS_MULTIPLE_SUMMARY_REPORT_ID
        break
      case JourneysReportType.singleFull:
        reportId = process.env.POWER_BI_JOURNEYS_SINGLE_FULL_REPORT_ID
        break
      case JourneysReportType.singleSummary:
        reportId = process.env.POWER_BI_JOURNEYS_SINGLE_SUMMARY_REPORT_ID
        break
    }

    if (
      process.env.POWER_BI_CLIENT_ID == null ||
      process.env.POWER_BI_CLIENT_SECRET == null ||
      process.env.POWER_BI_TENANT_ID == null ||
      process.env.POWER_BI_WORKSPACE_ID == null ||
      reportId == null
    ) {
      throw new ApolloError('server environment variables missing')
    }

    const config = {
      clientId: process.env.POWER_BI_CLIENT_ID,
      clientSecret: process.env.POWER_BI_CLIENT_SECRET,
      tenantId: process.env.POWER_BI_TENANT_ID,
      workspaceId: process.env.POWER_BI_WORKSPACE_ID
    }

    try {
      return await getPowerBiEmbed(config, reportId, userId)
    } catch (err) {
      throw new ApolloError(err.message)
    }
  }

  @Query()
  async adminJourneys(
    @CurrentUserId() userId: string,
    @Args('status') status: JourneyStatus[]
  ): Promise<Journey[]> {
    return await this.journeyService.getAllByOwnerEditor(userId, status)
  }

  @Query()
  async adminJourney(
    @CurrentUserId() userId: string,
    @Args('id') id: string,
    @Args('idType') idType: IdType = IdType.slug
  ): Promise<Journey | null> {
    const result: Journey =
      idType === IdType.slug
        ? await this.journeyService.getBySlug(id)
        : await this.journeyService.get(id)
    if (result == null) return null
    const ujResult = await this.userJourneyService.forJourneyUser(
      result.id,
      userId
    )
    if (ujResult == null)
      throw new ForbiddenError(
        'User has not received an invitation to edit this journey.'
      )
    if (ujResult.role === UserJourneyRole.inviteRequested)
      throw new ForbiddenError('User invitation pending.')

    return result
  }

  @Query()
  async journeys(@Args('where') where?: JourneysFilter): Promise<Journey[]> {
    return await this.journeyService.getAllPublishedJourneys(where)
  }

  @Query()
  async journey(
    @Args('id') id: string,
    @Args('idType') idType: IdType = IdType.slug
  ): Promise<Journey | null> {
    const result: Journey =
      idType === IdType.slug
        ? await this.journeyService.getBySlug(id)
        : await this.journeyService.get(id)
    if (result?.publishedAt == null) return null
    return result
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async journeyCreate(
    @Args('input') input: JourneyCreateInput & { id?: string },
    @CurrentUserId() userId: string
  ): Promise<Journey | undefined> {
    input.id = input.id ?? uuidv4()
    input.slug = slugify(input.slug ?? input.title, {
      lower: true,
      strict: true
    })
    let retry = true
    while (retry) {
      try {
        const journey: Journey = await this.journeyService.save({
          themeName: ThemeName.base,
          themeMode: ThemeMode.light,
          createdAt: new Date().toISOString(),
          status: JourneyStatus.draft,
          ...input
        })
        await this.userJourneyService.save({
          userId,
          journeyId: journey.id,
          role: UserJourneyRole.owner
        })
        retry = false
        return journey
      } catch (err) {
        if (err.errorNum === ERROR_ARANGO_UNIQUE_CONSTRAINT_VIOLATED) {
          input.slug = slugify(`${input.slug}-${input.id}`)
        } else {
          retry = false
          throw err
        }
      }
    }
  }

  @Mutation()
  @UseGuards(RoleGuard('id', [UserJourneyRole.owner, UserJourneyRole.editor]))
  async journeyDuplicate(
    @Args('id') id: string,
    @CurrentUserId() userId: string
  ): Promise<Journey | undefined> {
    const journey: Journey = await this.journeyService.get(id)
    const duplicateJourneyId = uuidv4()

    const title = journey.title.split(' copy')[0]
    const existingDuplicateJourneys = await this.journeyService.getAllByTitle(
      title
    )
    const duplicateTitle = `${title} ${
      existingDuplicateJourneys.length === 1
        ? 'copy'
        : `copy ${existingDuplicateJourneys.length}`
    }`

    const slug = slugify(duplicateTitle, {
      lower: true,
      strict: true
    })

    const originalBlocks = await this.blockService.getBlocksByType(
      journey,
      'StepBlock'
    )

    const duplicateStepIds = new Map()
    originalBlocks.forEach((block) => {
      duplicateStepIds.set(block.id, uuidv4())
    })

    const duplicateBlocks = await this.blockService.getDuplicateChildren(
      originalBlocks,
      id,
      null,
      duplicateStepIds,
      duplicateJourneyId,
      duplicateStepIds
    )

    const input = {
      ...journey,
      id: duplicateJourneyId,
      slug,
      title: duplicateTitle,
      createdAt: new Date().toISOString(),
      publishedAt: undefined,
      status: JourneyStatus.draft
    }

    let retry = true
    while (retry) {
      try {
        const journey: Journey = await this.journeyService.save(input)
        await this.blockService.saveAll(duplicateBlocks)
        await this.userJourneyService.save({
          userId,
          journeyId: journey.id,
          role: UserJourneyRole.owner
        })
        retry = false
        return journey
      } catch (err) {
        if (err.errorNum === ERROR_ARANGO_UNIQUE_CONSTRAINT_VIOLATED) {
          input.slug = slugify(`${input.slug}-${input.id}`)
        } else {
          retry = false
          throw err
        }
      }
    }
  }

  @Mutation()
  @UseGuards(RoleGuard('id', [UserJourneyRole.owner, UserJourneyRole.editor]))
  async journeyUpdate(
    @Args('id') id: string,
    @Args('input') input: JourneyUpdateInput
  ): Promise<Journey> {
    if (input.slug != null)
      input.slug = slugify(input.slug, {
        lower: true,
        strict: true
      })
    try {
      return await this.journeyService.update(id, input)
    } catch (err) {
      if (err.errorNum === ERROR_ARANGO_UNIQUE_CONSTRAINT_VIOLATED) {
        throw new UserInputError('Slug is not unique')
      } else {
        throw err
      }
    }
  }

  @Mutation()
  @UseGuards(RoleGuard('id', UserJourneyRole.owner))
  async journeyPublish(@Args('id') id: string): Promise<Journey> {
    return await this.journeyService.update(id, {
      status: JourneyStatus.published,
      publishedAt: new Date().toISOString()
    })
  }

  @Mutation()
  @UseGuards(RoleGuard('ids', UserJourneyRole.owner))
  async journeysArchive(
    @CurrentUserId() userId: string,
    @Args('ids') ids: string[]
  ): Promise<Journey[]> {
    const results = (await this.journeyService.getAllByIds(userId, ids)).map(
      (journey) => ({
        _key: journey.id,
        status: JourneyStatus.archived,
        archivedAt: new Date().toISOString()
      })
    )

    return (await this.journeyService.updateAll(
      results
    )) as unknown as Journey[]
  }

  @Mutation()
  @UseGuards(RoleGuard('ids', UserJourneyRole.owner))
  async journeysDelete(
    @CurrentUserId() userId: string,
    @Args('ids') ids: string[]
  ): Promise<Journey[]> {
    const results = (await this.journeyService.getAllByIds(userId, ids)).map(
      (journey) => ({
        _key: journey.id,
        status: JourneyStatus.deleted,
        deletedAt: new Date().toISOString()
      })
    )
    return (await this.journeyService.updateAll(
      results
    )) as unknown as Journey[]
  }

  @Mutation()
  @UseGuards(RoleGuard('ids', UserJourneyRole.owner))
  async journeysTrash(
    @CurrentUserId() userId: string,
    @Args('ids') ids: string[]
  ): Promise<Journey[]> {
    const results = (await this.journeyService.getAllByIds(userId, ids)).map(
      (journey) => ({
        _key: journey.id,
        status: JourneyStatus.trashed,
        trashedAt: new Date().toISOString()
      })
    )

    return (await this.journeyService.updateAll(
      results
    )) as unknown as Journey[]
  }

  @Mutation()
  @UseGuards(RoleGuard('ids', UserJourneyRole.owner))
  async journeysRestore(
    @CurrentUserId() userId: string,
    @Args('ids') ids: string[]
  ): Promise<Journey[]> {
    const results = (await this.journeyService.getAllByIds(userId, ids)).map(
      (journey) => ({
        _key: journey.id,
        status:
          journey.publishedAt == null
            ? JourneyStatus.draft
            : JourneyStatus.published
      })
    )

    return (await this.journeyService.updateAll(
      results
    )) as unknown as Journey[]
  }

  @ResolveField()
  async blocks(@Parent() journey: Journey): Promise<Block[]> {
    return await this.blockService.forJourney(journey)
  }

  @ResolveField()
  async primaryImageBlock(
    @Parent() journey: Journey & { primaryImageBlockId?: string | null }
  ): Promise<ImageBlock | null> {
    if (journey.primaryImageBlockId == null) return null
    return await this.blockService.get(journey.primaryImageBlockId)
  }

  @ResolveField()
  async userJourneys(@Parent() journey: Journey): Promise<UserJourney[]> {
    return await this.userJourneyService.forJourney(journey)
  }

  @ResolveField('language')
  async language(
    @Parent() journey
  ): Promise<{ __typename: 'Language'; id: string }> {
    // 529 (english) is default if not set
    return { __typename: 'Language', id: journey.languageId ?? '529' }
  }
}
