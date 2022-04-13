import React, { ReactElement, useState } from 'react'
import { VideoType } from '../../../__generated__/globalTypes'
import { VideoList } from './VideoList/VideoList'
import { LanguageSearch } from './LanguageSearch';


export function Videos(): ReactElement {
  const [languageIds, setLanguageIds] = useState('529')
  const onChange = (_e: never, option: { id: React.SetStateAction<string>; } | null):void => {
    if (option !== null) {
      setLanguageIds(option.id)
    }
  }

  return (
    <>
      <LanguageSearch
        onChange={onChange}
      />

      <VideoList
        filter={{
          availableVariantLanguageIds: [languageIds],
          types: [VideoType.playlist, VideoType.standalone]
        }}
      />
    </>
  )
}
