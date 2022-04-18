import React, { ReactElement, useState } from 'react'
import Grid from '@mui/material/Grid'
import { VideoType } from '../../../__generated__/globalTypes'
import { VideoList } from './VideoList/VideoList'
import { LanguageSearch } from './LanguageSearch'
import { VideoTypeFilter } from './VideoTypeFilter'
import { VideoTitleFilter } from './VideoTitleFilter'
import { TagSearch } from './TagSearch'

export function Videos(): ReactElement {
  const [languageIds, setLanguageIds] = useState('529')
  const [types, setTypes] = useState([VideoType.standalone, VideoType.playlist])
  const [title, setTitle] = useState(null)
  const [tagId, setTagId] = useState(null)

  const onLanguageChange = (
    _e,
    option: { id: React.SetStateAction<string> } | null
  ): void => {
    if (option !== null) {
      setLanguageIds(option.id)
    }
  }
  const onTypeChange = (_e, option): void => {
    setTypes(option ?? [])
  }
  const onTitleChange = (e): void => {
    setTitle(e.target.value)
  }
  const onTagChange = (
    _e,
    option: { id: React.SetStateAction<string> } | null
  ): void => {
    console.log(option)
    if (option !== null) {
      setTagId(option.id)
    } else {
      setTagId(null)
    }
  }

  return (
    <>
      <Grid
        container
        spacing={4}
        display="flex"
        alignItems="baseline"
        sx={{ my: 4 }}
      >
        <Grid item>
          <LanguageSearch onChange={onLanguageChange} />
        </Grid>
        <Grid item>
          <VideoTypeFilter onChange={onTypeChange} />
        </Grid>
        <Grid item>
          <VideoTitleFilter onChange={onTitleChange} />
        </Grid>
        <Grid item>
          <TagSearch onChange={onTagChange} />
        </Grid>
      </Grid>

      <VideoList
        filter={{
          availableVariantLanguageIds: [languageIds],
          types: types,
          tagId: tagId,
          title: title
        }}
      />
    </>
  )
}
