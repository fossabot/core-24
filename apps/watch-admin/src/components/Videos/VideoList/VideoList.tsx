import { gql, useQuery } from '@apollo/client'
import { ReactElement, useEffect, useState } from 'react'

import { GetVideos } from '../../../../__generated__/GetVideos'
import { VideosFilter } from '../../../../__generated__/globalTypes'
import { VideoListList } from './List/VideoListList'

export const GET_VIDEOS = gql`
  query GetVideos($where: VideosFilter, $offset: Int, $limit: Int) {
    videos(where: $where, offset: $offset, limit: $limit) {
      id
      type
      image
      snippet {
        primary
        value
      }
      title {
        primary
        value
      }
      variant {
        duration
      }
      episodeIds
      permalink
    }
  }
`

interface VideoListProps {
  filter?: VideosFilter
}

function isAtEnd(count: number, limit: number, previousCount: number): boolean {
  if (count === previousCount) return true
  return count % limit !== 0
}

export function VideoList({
  filter = {}
}: VideoListProps): ReactElement {
  const [isEnd, setIsEnd] = useState(false)
  const [previousCount, setPreviousCount] = useState(0)
  const limit = 100
  const { data, loading, fetchMore } = useQuery<GetVideos>(GET_VIDEOS, {
    variables: {
      where: filter,
      offset: 0,
      limit: limit
    }
  })

  useEffect(() => {
    setIsEnd(isAtEnd(data?.videos.length ?? 0, limit, previousCount))
  }, [data?.videos.length, setIsEnd, limit, previousCount])

  const handleLoadMore = async (): Promise<void> => {
    if (isEnd) return

    setPreviousCount(data?.videos.length ?? 0)
    await fetchMore({
      variables: {
        offset: data?.videos.length ?? 0
      }
    })
  }

  return (
    <VideoListList
      videos={data?.videos ?? []}
      onLoadMore={handleLoadMore}
      loading={loading}
      isEnd={isEnd}
    />
  )
}
