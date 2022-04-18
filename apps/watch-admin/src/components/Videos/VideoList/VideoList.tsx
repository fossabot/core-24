import { gql, useQuery } from '@apollo/client'
import { ReactElement, useState } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Image from 'next/image'
import { GetVideos } from '../../../../__generated__/GetVideos'
import { VideosFilter } from '../../../../__generated__/globalTypes'

interface Column {
  id:
    | 'image'
    | 'id'
    | 'title'
    | 'snippet'
    | 'type'
    | 'duration'
    | 'episodeIds'
    | 'permalink'
  label: string
  minWidth: number
}

const columns: readonly Column[] = [
  { id: 'image', label: 'Image', minWidth: 160 },
  { id: 'id', label: 'Id', minWidth: 80 },
  { id: 'title', label: 'Titles', minWidth: 160 },
  { id: 'snippet', label: 'Snippets', minWidth: 240 },
  { id: 'type', label: 'Type', minWidth: 60 },
  { id: 'duration', label: 'Duration', minWidth: 40 },
  {
    id: 'episodeIds',
    label: 'Episodes',
    minWidth: 40
  },
  {
    id: 'permalink',
    label: 'Permalink',
    minWidth: 40
  }
]

export const GET_VIDEOS = gql`
  query GetVideos($where: VideosFilter, $offset: Int, $limit: Int) {
    videos(where: $where, offset: $offset, limit: $limit) {
      id
      type
      image
      snippet {
        value
      }
      title {
        value
      }
      seoTitle {
        value
      }
      description {
        value
      }
      variant {
        duration
      }
      episodes {
        id
        permalink
        noIndex
      }
      permalink
      noIndex
      imageAlt {
        value
      }
      primaryLanguageId
    }
  }
`
interface VideoListProps {
  filter?: VideosFilter
}

export function VideoList({ filter = {} }: VideoListProps): ReactElement {
  const [limit, setLimit] = useState(1000)
  const [offset, setOffset] = useState(0)
  const { data, fetchMore } = useQuery<GetVideos>(GET_VIDEOS, {
    variables: {
      where: filter,
      offset: offset,
      limit: limit
    }
  })

  const handleSetOffset = async (_e, offset): Promise<void> => {
    setOffset(offset)
    await fetchMore({
      variables: {
        offset: offset
      }
    })
  }

  const handleSetLimit = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    setLimit(parseInt(event.target.value, 10))
    await fetchMore({
      variables: {
        limit: limit
      }
    })
  }

  return (
    <Paper
      sx={{ width: '100%', overflow: 'hidden' }}
      data-testid="video-list-list"
    >
      <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(data?.videos ?? []).map((video, index) => {
              const title = video.title.find((title) => title.primary)?.value
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell key={`${index}-cell0`}>
                    <Image
                      src={video.image ?? ''}
                      alt={title}
                      height="90"
                      width="160"
                    />
                  </TableCell>
                  <TableCell key={`${index}-cell1`}>
                    {video.id} {index}
                  </TableCell>
                  <TableCell key={`${index}-cell2`}>
                    {video.title.map((title) => title.value).join(', ')}
                  </TableCell>
                  <TableCell key={`${index}-cell3`}>
                    {video.snippet.map((snippet) => snippet.value).join(', ')}
                  </TableCell>
                  <TableCell key={`${index}-cell4`}>{video.type}</TableCell>
                  <TableCell key={`${index}-cell5`}>
                    {video.variant?.duration}
                  </TableCell>
                  <TableCell key={`${index}-cell6`}>
                    {video.episodeIds.join(', ')}
                  </TableCell>
                  <TableCell key={`${index}-cell7`}>
                    {video.permalink}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100, 1000]}
        component="div"
        count={10000000}
        rowsPerPage={limit}
        page={offset}
        onPageChange={handleSetOffset}
        onRowsPerPageChange={handleSetLimit}
      />
    </Paper>
  )
}
