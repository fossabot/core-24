import { Injectable } from '@nestjs/common'
import { aql } from 'arangojs'
import { BaseService } from '@core/nest/database'
import { DocumentCollection } from 'arangojs/collection'
import { KeyAsId } from '@core/nest/decorators'
import {
  Journey,
  JourneyStatus,
  UserJourneyRole,
  JourneysFilter
} from '../../__generated__/graphql'

@Injectable()
export class JourneyService extends BaseService {
  @KeyAsId()
  async getAllPublishedJourneys(filter?: JourneysFilter): Promise<Journey[]> {
    if (filter?.featured === true) {
      return await (
        await this.db.query(aql`
          FOR journey IN ${this.collection}
            FILTER journey.status == ${JourneyStatus.published}
              AND journey.featuredAt != null
            RETURN journey
        `)
      ).all()
    } else if (filter?.featured === false) {
      return await (
        await this.db.query(aql`
          FOR journey IN ${this.collection}
            FILTER journey.status == ${JourneyStatus.published}
              AND journey.featuredAt == null
            RETURN journey
        `)
      ).all()
    }
    return await (
      await this.db.query(aql`
        FOR journey IN ${this.collection}
          FILTER journey.status == ${JourneyStatus.published}
          RETURN journey
      `)
    ).all()
  }

  @KeyAsId()
  async getBySlug(_key: string): Promise<Journey> {
    const result = await this.db.query(aql`
      FOR journey in ${this.collection}
        FILTER journey.slug == ${_key}
          AND (journey.status == ${JourneyStatus.published} || journey.status == ${JourneyStatus.draft}) || journey.status == ${JourneyStatus.archived})
        LIMIT 1
        RETURN journey
    `)
    return await result.next()
  }

  @KeyAsId()
  async getAllByOwner(userId: string): Promise<Journey[]> {
    const result = await this.db.query(aql`
    FOR userJourney in userJourneys
      FOR journey in ${this.collection}
          FILTER userJourney.journeyId == journey._key && userJourney.userId == ${userId}
           && userJourney.role == ${UserJourneyRole.owner}
          RETURN journey
    `)
    return await result.all()
  }

  @KeyAsId()
  async getAllByOwnerEditor(
    userId: string,
    status: JourneyStatus[]
  ): Promise<Journey[]> {
    const result = await this.db.query(aql`
    FOR userJourney in userJourneys
      FOR journey in ${this.collection}
          FILTER userJourney.journeyId == journey._key && userJourney.userId == ${userId}
           && (userJourney.role == ${UserJourneyRole.owner} || userJourney.role == ${UserJourneyRole.editor})
           && journey.status IN ${status}
          RETURN journey
    `)
    return await result.all()
  }

  collection: DocumentCollection = this.db.collection('journeys')
}
